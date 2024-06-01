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

export const plainYear = new Map(months
    .map(([m, dn]) => 
        rangeArray(dn)
        .map(d => [`${m}-${d}`, []])
    ).flat())


export function intoYear(blocks, currentYear) {
    // console.log(year)
    const year = currentYear || plainYear
    if (blocks === null) return year

    blocks.forEach(block => {
        const {month, day, fullyear} = dayOfYear(block.title, block.connected_at, block.created_at)
        const date = `${month}-${day}`
        const pastArray = year.get(date) ?? []
        block.fullyear = fullyear
        const nextArray = [...pastArray, block]
        year.set(date, nextArray)
    })

    return year
}