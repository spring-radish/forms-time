export function blocksToYear(blocks) {
    const year = new Map()

    for (const block of blocks) {
        const date = detectDate(block)
        const oldday = year.get(date) || []
        const newday = oldday.concat(block)
        year.set(date, newday)
    }

    return [...year]
}

export function detectDate(block) {
    const formats = new RegExp(/(\d{1,2}\W\d{1,2}\W\d{2,4})|(\d{2,4}\W?\d{2}\W?\d{2})|(\d{1,2}\D{3,12}\d{2,4})|([A-Za-z,]{3,12}\d{1,2}\W{0,2}\d{4})/g)
    const textual = new String(block.title).concat(block.content)
    const matches = textual.match(formats) || []
    // console.log(matches)

    const fallback = block.connected_at || block.created_at
    const options = matches.concat(fallback)

    const validDate = options.find(m => !isNaN(Date.parse(m)))
    // console.log(options)

    const date = new Date(validDate)
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}-${day}`
}