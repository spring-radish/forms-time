import {dayOfYear} from './day.js'

const dateFormat = ([m, d]) => 
    `${m}-${d}`

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

// function monthList([monthIndex, dayArray]) {
//     return dayArray.map(d =>
//         `<li id=${monthIndex}.${d}></li>`)
// }

// export function yearList(year = plainYear) {
//     return [...year]
//         .map(([date, array]) => ``)
// }


export function intoYear(blocks, currentYear) {
    // console.log(year)
    const year = currentYear || plainYear
    if (blocks === null) return year

    blocks.forEach(block => {
        const arrayDate = dayOfYear(block.title, block.connected_at, block.created_at)
        const date = dateFormat(arrayDate)
        const pastArray = year.get(date) ?? []
        const nextArray = [...pastArray, block]
        year.set(date, nextArray)
    })

    return year
}