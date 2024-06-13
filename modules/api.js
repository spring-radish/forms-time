const requestHistory = {
    channels: new Map(),
    users: new Map(),
    blocks: new Map(),
}

export async function dispatchUrl(input) {
    const userpageRoutes = ['channels', 'blocks', 'table', 'index', 'all']

    const path = input    // e.g. 'https://www.are.na/elliott-cost/model-sites/'
        .split('are.na')        // -> ['https://www.', '/elliott-cost/model-sites/']
        .at(-1)                 // -> '/elliott-cost/model-sites/'
        .split('/')             // -> ["", "elliott-cost", "model-sites", ""]
        .filter(s => s.length)  // -> ["elliott-cost", "model-sites"]

    console.log(path)

    switch (true) {
        case (path.length === 0):
            return requestEmpty()
        case (path.length === 2 && userpageRoutes.includes(path[1])):
            return requestUser(path[0])
        case (path.length === 2 && path[0] === 'block'):
            // return requestBlock(path.at(-1))
        default:
            return requestChannel(path.at(-1))
    }
}


function requestEmpty() {
    return {
        message: "don't recognize this url... try copying directly from the address bar", 
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
        const latestHistory = (response.length === 100) 
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


// todo: how to get connected_at date?
async function requestBlock(slug) {
    const sendBlockRequest = async function (slug) {
        const url = 'https://api.are.na/v2/blocks/' + slug
        
        console.log('requesting all connections')

        const response = await fetch(url)
        if (!response.ok) throw new Error(`http error: ${response.status}`)

        const block = await response.json()
        return block.connections
    }

    try {
        const slugHistory = requestHistory.blocks.get(slug) || []
        const page = pickPage(slugHistory)
        const response = await sendBlockRequest(slug)

        console.log(response)
        const latestHistory = {page: page, status: 'end'}

        requestHistory.blocks.set(slug, [...slugHistory, latestHistory])
        console.log(requestHistory)

        const blockTitle = response.title || response.source?.title || response.generated_title
        const blockId = response.id

        const connectionsAsBlocks = response.map(connection => {
            connection.block_title = blockTitle
            connection.block_id = blockId
        })

        return {message: `added block ${slug}'s connections`, blocks: connectionsAsBlocks}
    }
    catch (exception) {
        return {message: exception.message, blocks: null}
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