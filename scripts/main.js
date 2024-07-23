// tally

/**
 * Imports
 */
import { dispatchUrl } from "./api.js";
import { renderDay } from "./blocks.js";
import { blocksToYear } from "./timestructures.js";
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

/**
 * State
 */
let BIGYEAR = undefined;



/**
 * Overall Plan
 */
function init() {
	channelPicker.addEventListener("submit", clickDo);
	zoomSlider.addEventListener("input", scaleGrid);
    document.addEventListener("keyup", hearKey);
    scaleGrid();
	highlightToday();
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

    // Amend the tome
    BIGYEAR = blocksToYear(blocks);
    addDays()
    updateYears()
    status.innerText = message;

    // Reopen the portal
    channelUrl.removeAttribute("disabled");
    channelGo.removeAttribute("disabled");
}

/**
 * Pieces of the Puzzle
 */
function addDays() {
    for (const [date, blocks] of BIGYEAR.days) {
        const li = document.getElementById(date);
        if (!li) {
            console.log(`Skipping ${blocks.length} block(s) with date ${date}.`);
            continue;
        }
        li.innerHTML = renderDay(blocks, date);
    }
}

function updateYears() {
    yearsLegend.innerHTML = [...BIGYEAR.info.yearsRepresented]
        .sort()
        .map((y) => `<li class='year-${y}'>${y}</li>`)
        .join(" ");
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



/**
 * Unimplemented function to programatically
 * generate a color scale for yearsLegend
 */
function makeColor(year) {}