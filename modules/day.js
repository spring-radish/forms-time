const msPerDay = 1000 * 60 * 60 * 24
const timezoneOffset = new Date().getTimezoneOffset()

function findDate(...strings) {
    return strings
        .filter(s => s && (typeof s === 'string'))
        .map(s => new Date(s))
        .find(d => !isNaN(d.valueOf()))
}

export function dayOfYear(...possibleDateStrings) {
    const date = findDate(...possibleDateStrings)
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [month, day]
}