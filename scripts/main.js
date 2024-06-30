// tally

import { dispatchUrl } from './api.js'
import { intoYear } from './year.js'
import { renderDay } from './blocks.js'
import cachedResponse from './cachedApi.json' assert {type: 'json'}



const channelPicker = document.getElementById('channel-picker')
const channelUrl = document.getElementById('channel-url')
const channelGo = document.getElementById('channel-go')
const status = document.getElementById('status')
const calendarList = document.getElementById('calendar-list')
const zoomSlider = document.getElementById('zoom-slider')
const yearsLegend = document.getElementById('years-legend')
const booksDatalist = document.getElementById('books')
const inStyle = document.querySelector('style')


let BIGCAL = null



async function init() {
    channelPicker.addEventListener('submit', clickDo)
    zoomSlider.addEventListener('input', scaleGrid)
    const message = await addDays(null)
    status.innerText = message
    // books.innerHTML = await getSuggestions('https://www.are.na/rosemary/how-i-did-it')
    inStyle.sheet.insertRule(todaysId())
}

function todaysId() {
    const today = new Date()
    const month = today.getMonth() + 1
    const day = today.getDate()
    return `#calendar-list [id="${month}-${day}"] {border: 3px double #e5e4ff}`
}

async function addDays(url) {
    // const {message, blocks} = {message: 'ready to go', blocks: cachedResponse.contents}
    const {message, blocks} = url ? await dispatchUrl(url) 
        : {message: 'ready to go', blocks: null}

    console.log('message', message)
    console.log(blocks)

    const year = intoYear(blocks, BIGCAL)
    const yearHtml = [...year.days]
        .map(([date, blocks]) =>
            renderDay(blocks, date))
        .join(' ')

    if (!document.startViewTransition) {
        calendarList.innerHTML = yearHtml
    } else {
        document.startViewTransition(() => {calendarList.innerHTML = yearHtml});
    }
    

    BIGCAL = year
    console.log(year.info)
    yearsLegend.innerHTML = [...year.info.yearsRepresented]
        .sort()
        .map(y => `<li class='year-${y}'>${y}</li>`)
        .join(' ')

    return message
}

function makeColor(year) {

}

async function clickDo(e) {
    e.preventDefault()
    channelUrl.setAttribute('disabled', '')
    channelGo.setAttribute('disabled', '')

    const url = channelUrl.value

    status.innerText = `getting ${url}`

    const message = await addDays(url)

    status.innerText = message

    channelUrl.removeAttribute('disabled')
    channelGo.removeAttribute('disabled')
}


function scaleGrid(e) {
    const zoomLevel = e.target.value
    calendarList.style = `--zoom: ${zoomLevel}rem`
}



init()