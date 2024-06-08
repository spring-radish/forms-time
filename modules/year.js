import {dayOfYear} from './day.js'

function rangeArray(n) {
    return Array(n)
        .fill(0)
        .map((_, i) => i+1)
}

const months = [
    [1, 31],
    [2, 29],
    [3, 31],
    [4, 30],
    [5, 31],
    [6, 30],
    [7, 31],
    [8, 31],
    [9, 30],
    [10, 31],
    [11, 30],
    [12, 31]
]

const base = new Map(months
    .map(([m, dn]) => 
        rangeArray(dn)
        .map(d => [`${m}-${d}`, []])
    ).flat())

const plainYear = {
    days: base,
    info: {
        yearsRepresented: new Set()
    }
}


export function intoYear(blocks, currentYear) {
    const year = currentYear || plainYear
    if (blocks === null) return year

    const {days, info} = year
    // console.log(year)

    blocks.forEach(block => {
        const {month, day, fullyear} = dayOfYear(block.title, block.connected_at, block.created_at)
        const date = `${month}-${day}`
        const pastArray = days.get(date) ?? []
        block.fullyear = fullyear
        const nextArray = [...pastArray, block]
        days.set(date, nextArray)
        info.yearsRepresented.add(fullyear)
    })

    return {days, info}
}