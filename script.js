import { getChannelPage } from './modules/api.js'
import { intoYear } from './modules/year.js'
import { renderDay } from './modules/blocks.js'



const channelPicker = document.getElementById('channel-picker')
const channelUrl = document.getElementById('channel-url')
const channelGo = document.getElementById('channel-go')
const status = document.getElementById('status')
const calendarList = document.getElementById('calendar-list')
const zoomSlider = document.getElementById('zoom-slider')


let BIGCAL = null



async function init() {
    channelPicker.addEventListener('submit', clickDo)
    zoomSlider.addEventListener('input', scaleGrid)
    const message = await addDays(null)
    status.innerText = message
}

async function addDays(url) {
    // const blocks = cachedResponse.contents
    const {message, blocks} = url ? await getChannelPage(url) 
        : {message: 'ready to go', blocks: null}

    console.log('message', message)

    const thisYear = intoYear(blocks, BIGCAL)
    const yearHtml = [...thisYear]
        .map(([date, blocks]) =>
            renderDay(blocks, date))
        .join(' ')

    calendarList.innerHTML = yearHtml
    BIGCAL = thisYear

    return message
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
    console.log('zoom', zoomLevel)
    calendarList.style = `--zoom: ${zoomLevel}rem`
}



init()