const msPerDay = 1000 * 60 * 60 * 24
const timezoneOffset = new Date().getTimezoneOffset()
const idtf = new Intl.DateTimeFormat('en-US', {  
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',})

function findDate(...strings) {
    return strings
        .filter(s => s 
            && (typeof s === 'string')
            && s.match(/\d{1,2}\D+\d{2,4}/))
        .map(s => new Date(s))
        .find(d => !isNaN(d.valueOf()))
}

export function dayOfYear(...possibleDateStrings) {
    const date = findDate(...possibleDateStrings)
    const month = date.getMonth() + 1
    const monthname = idtf.format(date)
    const day = date.getDate()
    const fullyear = date.getFullYear()

    return {month, day, fullyear, monthname}
}