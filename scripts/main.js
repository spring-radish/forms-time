import { dispatchUrl } from "./api.js";
import { intoYear } from "./year.js";
import { renderDay } from "./blocks.js";
import { blocksToYear } from "./timestructures.js";
import cachedResponse from "./cachedApi.json" assert { type: "json" };

const channelPicker = document.getElementById("channel-picker");
const channelUrl = document.getElementById("channel-url");
const channelGo = document.getElementById("channel-go");
const status = document.getElementById("status");
const calendarList = document.getElementById("calendar-list");
const zoomSlider = document.getElementById("zoom-slider");
const yearsLegend = document.getElementById("years-legend");

let BIGCAL = null;

function init() {
	channelPicker.addEventListener("submit", clickDo);
	zoomSlider.addEventListener("input", scaleGrid);
	// const message = await addDays(null)
	// status.innerText = message
}

function todaysId() {
	const today = new Date();
	const month = today.getMonth() + 1;
	const day = today.getDate();
	return `li[id="${month}-${day}"] {border: 3px double inherit}`;
}

async function addDays(url) {
	const { message, blocks } = {
		message: "ready to go",
		blocks: cachedResponse.contents,
	};
	// const {message, blocks} = url ? await dispatchUrl(url)
	//     : {message: 'ready to go', blocks: null}

	console.log("message", message);
	console.log(blocks);

	const newDays = blocksToYear(blocks);

	for (const [date, blocks] of newDays) {
		const li = document.getElementById(date);
		li.style.background = "pink";
	}

	return message;
}

function makeColor(year) {}

async function clickDo(e) {
	e.preventDefault();
	channelUrl.setAttribute("disabled", "");
	channelGo.setAttribute("disabled", "");

	const url = channelUrl.value;

	status.innerText = `getting ${url}`;

	const message = await addDays(url);

	status.innerText = message;

	channelUrl.removeAttribute("disabled");
	channelGo.removeAttribute("disabled");
}

function scaleGrid(e) {
	const zoomLevel = e.target.value;
	calendarList.style = `--zoom: ${zoomLevel}rem`;
}

init();
