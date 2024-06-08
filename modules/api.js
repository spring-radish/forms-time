let requestHistory = new Map()
// slug -> [{page: 1, status: ok}]

const userpageRoutes = ['channels', 'blocks', 'table', 'index', 'all']

export async function getChannelPage(input) {
    const path = input    // e.g. 'https://www.are.na/elliott-cost/model-sites/'
        .split('are.na')
        .at(-1)                 // '/elliott-cost/model-sites/'
        .split('/')             // [ "", "elliott-cost", "model-sites", "" ]
        .filter(s => s.length)  // ["elliott-cost", "model-sites"]

    console.log(path)

    let requestFunction = sendChannelRequest
    let slug = path.at(-1)

    if (path.length === 2 && userpageRoutes.includes(path[1])) {
        requestFunction = sendUserRequest
        slug = path[0]
    } else if (path.length === 2 && path[0] === 'block') {
        requestFunction = sendBlockRequest
    }

    let page = 1
    const slugHistory = requestHistory.get(slug) || []
    if (slugHistory.length) {
        if (slugHistory.some(h => h.status === 'end')) {
            console.log('no more pages')
            return {message: 'end of channel', blocks: null}
        }
        const pagesCovered = slugHistory
            .map(h => h.page)
        page = Math.max(...pagesCovered) + 1
    }

    try {
        const response = await sendChannelRequest(slug, page)

        // console.log(response)
        const latestHistory = (response.contents.length === 100) 
            ? {page: page}
            : {page: page, status: 'end'}

        requestHistory.set(slug, [...slugHistory, latestHistory])
        console.log(requestHistory)

        return {message: `added page ${page} of ${slug}`, blocks: response.contents}
    }
    catch (exception) {
        return {message: exception.message, blocks: null}
    }
}

async function sendChannelRequest(slug, page = 1) {
    const url = 'https://api.are.na/v2/channels/' + slug 
              + '/contents'
              + '?per=' + 100
              + '&page=' + page
              + '&sort=position'
              + '&direction=desc'
    
    console.log('requesting page', page, 'of', url)

    const response = await fetch(url)
    if (!response.ok) throw new Error('bad response')

    const channel = await response.json()
    return channel
}

async function sendBlockRequest() {
    // https://api.are.na/v2/blocks/8693/channels
}

async function sendUserRequest() {
    // https://api.are.na/v2/search/users/shea?subject=block&sort=created_at
}