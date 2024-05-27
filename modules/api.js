let requestHistory = new Map()
// slug -> [{page: 1, status: ok}]

export async function getChannelPage(input) {
    const slug = input
        .split('/')
        .findLast(s => s.length)

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
        const response = await sendRequest(slug, page)

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

async function sendRequest(slug, page = 1) {
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