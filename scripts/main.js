// tally

/**
 * Imports
 */
import { dispatchUrl } from "./api.js";
import { renderDay, renderArticleParts, renderPreviewParts, getBlocksField } from "./blocks.js";
import { blocksNewYear, toMergedYears } from "./timestructures.js";
// import cachedResponse from "./cachedApi.json" assert { type: "json" };

/**
 * Elements
 */
const channelPicker = document.getElementById("channel-picker");
const channelUrl = document.getElementById("channel-url");
const channelGo = document.getElementById("channel-go");
const status = document.getElementById("status");
const calendarList = document.getElementById("calendar-list");
const zoomSlider = document.getElementById("zoom-slider");
const yearsLegend = document.getElementById("years-legend");
const circumstances = document.getElementById("circumstances");
const animationCheckbox = document.getElementById("animation");

/**
 * State
 */
let STATE = {
    days: new Map(),
    // info: {
    //     yearsRepresented: new Set(),
    //     blockIds: new Set(),
    // }
};
// console.log(BIGYEAR)
// let count = 0


/**
 * Overall Plan
 */
function init() {
	channelPicker.addEventListener("submit", clickDo);
	zoomSlider.addEventListener("input", scaleGrid);
    document.addEventListener("keyup", hearKey);
    fillFields();
    scaleGrid();
	highlightToday();
    toggleAnimation();
	status.innerText = "ready to go";
}

init();



/**
 * Behind the Scenes
 */
async function clickDo(e) {
    // Hold the phone
    e.preventDefault();

    // Close the portal
    channelUrl.setAttribute("disabled", "");
    channelGo.setAttribute("disabled", "");

    // Repeat the question
    const url = channelUrl.value;
    status.innerText = `getting ${url}`;

    // Seek the answer
    const {message, blocks} = await dispatchUrl(url);
    // const message = `test page ${count}`
    // const blocks = cachedResponse.contents[count]
    // count += 1

    // Amend the tome

    if (blocks) {
        /**
         * Diff strategy: 
         * 1. make year with only new blocks
         * 2. insert those blocks into the page
         * 3. merge into STATE
         */
        const blockIds = getBlocksField(STATE.days, 'id')
        // console.log(blockIds)
        const newDays = blocksNewYear(blocks, blockIds)
        // console.log(state)
        insertDays(newDays)
        STATE.days = toMergedYears(STATE.days, newDays)
        // console.log(STATE.days)
        updateYears(STATE.days)
    }

    status.innerText = message;

    // Reopen the portal
    channelUrl.removeAttribute("disabled");
    channelGo.removeAttribute("disabled");
}

/**
 * Pieces of the Puzzle
 */
function insertDays(days) {
    for (const [date, blocks] of days) {
        const li = document.getElementById(date);
        if (!li) {
            console.log(`Skipping ${blocks.length} block(s) with date ${date}.`);
        } else if (!li.hasChildNodes()) {
            li.innerHTML = renderDay(blocks, date);
        } else {
            const transom = li.querySelector('.transom')
            const article = li.querySelector('article')
            transom.insertAdjacentHTML("beforeend", renderPreviewParts(blocks))
            article.insertAdjacentHTML("beforeend", renderArticleParts(blocks))
        }
    }
}

function updateYears(days) {
    const yearsRepresented = getBlocksField(days, 'fullyear')
    const yearsList = Array.from(yearsRepresented)
        .sort()
        .map((y) => `<li class='year-${y}'>${y}</li>`)
        .join(" ");
    yearsLegend.innerHTML = yearsList
}

function scaleGrid() {
    const zoomLevel = zoomSlider.value;
    calendarList.style = `--zoom: ${zoomLevel}rem`;
}

function hearKey(e) {
    const dayIsOpen = window.location.hash.startsWith("#inner");

    switch (e.key) {
        case "Escape":
            if (dayIsOpen) {
                window.location.hash = "#circumstances"
                break
            } 
            circumstances.toggleAttribute('open')
            break
        case "ArrowRight":
            if (dayIsOpen) {
                const currentDay = window.location.hash.replace('#inner-', '')
                const nextDay = findNextDay(currentDay)
                window.location.hash = `#inner-${nextDay}`
            }
            break
        case "ArrowLeft":
            if (dayIsOpen) {
                const currentDay = window.location.hash.replace('#inner-', '')
                const prevDay = findPrevDay(currentDay)
                window.location.hash = `#inner-${prevDay}`
            }
            break
    }
}

function findNextDay(id) {
    const firstOfJanuary = document.getElementById('1-1')
    let currentDay = document.getElementById(id)
    for (let i = 366; i > 0; i--) {
        currentDay = currentDay.nextElementSibling || firstOfJanuary;
        if (currentDay.hasChildNodes()) return currentDay.id;
    }
}
function findPrevDay(id) {
    const lastOfDecember = document.getElementById('12-31')
    let currentDay = document.getElementById(id)
    for (let i = 366; i > 0; i--) {
        currentDay = currentDay.previousElementSibling || lastOfDecember;
        if (currentDay.hasChildNodes()) return currentDay.id;
    }
}

function highlightToday() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const id = `${month}-${day}`;

    document.getElementById(id).classList.add('today');
}

function toggleAnimation() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion)').matches;
    // console.log(reduceMotion)
    if (reduceMotion) return;
    animationCheckbox.setAttribute('checked', '')
}

function fillFields() {
    const url = new URL(window.location)
    if (url.searchParams.size === 0) return
    for (const [key, value] of url.searchParams) {
        const element = circumstances.querySelector(`[name="${key}"]`)
        if (!element) continue;
        if (element.type === 'radio') {
            circumstances.querySelector(`[name="${key}"][value="${value}"]`).checked = true;
            // console.log('checked', value)
        } else {
            element.value = value
            // console.log('filled', key, 'with', value)
        }
    }
}



/**
 * Unimplemented function to programatically
 * generate a color scale for yearsLegend
 */
function makeColor(year) {}