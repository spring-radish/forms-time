export function blocksToYear(blocks) {
	const year = new Map();

	for (const block of blocks) {
		const clues = [
			block.title,
			block.content,
			block.connected_at,
			block.created_at,
		];
		const date = detectDate(clues);
		const oldday = year.get(date) || [];
		const newday = oldday.concat(block); // use .push if performance needs it
		year.set(date, newday);
	}

	return [...year];
}

export function detectDate(clues) {
	return clues.flatMap(tryDetectors).find(truthy);
}

function tryDetectors(clue) {
	return detectors.map((detector) => detector(String(clue)));
}

const detectors = [
	(clue) => {
		// 2033.01.22 or 20330122
		const match = clue.match(/\d{4}\W?(\d{2})\W?(\d{2})/);
		if (!match) return null;
		const month = trimLeadingZero(match[1]);
		const day = trimLeadingZero(match[2]);
		return `${month}-${day}`;
	},
	(clue) => {
		// 1-22-33 or 01-22-2033
		const match = clue.match(/(\d{1,2})\W(\d{1,2})\W\d{2,4}/);
		if (!match) return null;
		const month = trimLeadingZero(match[1]);
		const day = trimLeadingZero(match[2]);
		return `${month}-${day}`;
	},
	(clue) => {
		// 33.01.22 or 330122
		const match = clue.match(/\d{2}\W?(\d{2})\W?(\d{2})/);
		if (!match) return null;
		const month = trimLeadingZero(match[1]);
		const day = trimLeadingZero(match[2]);
		return `${month}-${day}`;
	},
	(clue) => {
		// January 22, 2033
		const match = clue.match(/([A-Za-z]{3,12}),? ?(\d{1,2})\W{0,2}\d{4}/);
		if (!match) return null;
		const date = new Date(match[0]);
		const month = date.getMonth() + 1;
		const day = trimLeadingZero(match[2]);
		return `${month}-${day}`;
	},
	(clue) => {
		// 22 January 2033
		const match = clue.match(/(\d{1,2}) ?([A-Za-z]{3,12}),? ?\d{2,4}/);
		if (!match) return null;
		const date = new Date(match[0]);
		const month = date.getMonth() + 1;
		const day = trimLeadingZero(match[1]);
		return `${month}-${day}`;
	},
];

function trimLeadingZero(str) {
	if (str.startsWith("0")) return str.slice(1);
	return str;
}

function truthy(x) {
	return Boolean(x);
}
