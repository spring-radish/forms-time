const requestHistory = {
    channels: new Map(),
    users: new Map(),
    // blocks: new Map(),
}

export async function dispatchUrl(input) {
    const viewRoutes = ['channels', 'blocks', 'table', 'index', 'all']

    const path = input                // e.g. 'https://www.are.na/elliott-cost/model-sites/table/'
        .split('are.na')                      // -> ['https://www.', '/elliott-cost/model-sites/table/']
        .at(-1)                               // -> '/elliott-cost/model-sites/table/'
        .split('/')                           // -> ["", "elliott-cost", "model-sites", "table", ""]
        .filter(s => s.length)                // -> ["elliott-cost", "model-sites", "table"]
        .filter(s => !viewRoutes.includes(s)) // -> ["elliott-cost", "model-sites"]

    console.log(path)
    const slug = path.at(-1)

    if (path[0] === 'block') return requestBlock()

    switch (path.length) {
        case 1:
            return requestUser(slug)
        case 2:
            return requestChannel(slug)
        default:
            return requestEmpty()
    }
}


function requestEmpty() {
    return {
        message: "don't recognize this url... try copying from the address bar of a channel or user page", 
        blocks: null
    }
}



async function requestChannel(slug) {
    const sendChannelRequest = async function (slug, page = 1) {
        const url = 'https://api.are.na/v2/channels/' + slug 
                  + '/contents'
                  + '?per=' + 100
                  + '&page=' + page
                  + '&sort=position'
                  + '&direction=desc'
        
        console.log('requesting page', page, 'of', url)

        const response = await fetch(url)
        if (!response.ok) throw new Error(`http error: ${response.status}`)

        const channel = await response.json()
        return channel.contents
    }

    try {
        const slugHistory = requestHistory.channels.get(slug) || []
        const page = pickPage(slugHistory)
        const response = await sendChannelRequest(slug, page)

        console.log(response)
        const latestHistory = (response.length < 0) 
            ? {page: page}
            : {page: page, status: 'end'}

        requestHistory.channels.set(slug, [...slugHistory, latestHistory])
        console.log(requestHistory)

        return {message: `added page ${page} of channel ${slug}`, blocks: response}
    }
    catch (exception) {
        return {message: exception.message, blocks: null}
    }
}


async function requestUser(slug) {
    const sendUserRequest = async function (slug, page = 1) {
        const url = 'https://api.are.na/v2/search/users/' + slug 
                  + '?subject=block'
                  + '&per=' + 100
                  + '&page=' + page
                  + '&sort=created_at'
                  + '&direction=desc'
        
        console.log('requesting page', page, 'of', url)

        const response = await fetch(url)
        if (!response.ok) throw new Error(`http error: ${response.status}`)

        const user = await response.json()
        return user.blocks
    }

    try {
        const slugHistory = requestHistory.users.get(slug) || []
        const page = pickPage(slugHistory)
        const response = await sendUserRequest(slug, page)

        console.log(response)
        const latestHistory = (response.length > 0) 
            ? {page: page}
            : {page: page, status: 'end'}

        requestHistory.users.set(slug, [...slugHistory, latestHistory])
        console.log(requestHistory)

        return {message: `added page ${page} of user ${slug}`, blocks: response}
    }
    catch (exception) {
        return {message: exception.message, blocks: null}
    }
}


function requestBlock() {
    return {
        message: 'i can’t show blocks... yet. if you know how to get all the connection dates for a block, hit my line', 
        blocks: null
    }
}


function pickPage(slugHistory) {
    if (slugHistory.length === 0) return 1

    if (slugHistory.some(h => h.status === 'end')) {
        console.log('no more pages')
        throw new Error('no more data')
    }

    const pagesCovered = slugHistory.map(h => h.page)
    return Math.max(...pagesCovered) + 1
}