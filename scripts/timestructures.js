/**
 * blocksToYear: (Array<Block>, Object) -> Object
 */
export function blocksToYear(blocks, year = emptyYear) {
    if (!blocks) return year;

	for (const block of blocks) {
        // The places to look for a date
		const clues = [
			block.title,
			block.content,
			block.connected_at,
			block.created_at,
		];
		const [blockDate, blockYear] = detectDate(clues);
		block.fullyear = blockYear;

		const day = year.days.get(blockDate);
		/**
		 * days: Map[
		 *          '1-22' -> [block, block],
		 *          '1-23' -> [block]
		 *           ...
		 *       ]
		 */
		if (day) day.push(block);
		else year.days.set(blockDate, [block]);

		/**
		 * info: {
		 *          blockIds: Set[id, id, id],
		 *          yearsRepresented: Set[year, year],
		 *       }
		 */
		year.info.blockIds.add(block.id);
		year.info.yearsRepresented.add(blockYear);
	}

	return year;
}

/**
 * detectDate: Array<String | undefined> -> [String, String]
 * Returns the first non-null date in the form ["M-D", "Y"].
 * Clues and detectors are both ordered by preference.
 * My style here wishes that JS could be lazy...
 */
export function detectDate(clues) {
	return clues.flatMap(tryDetectors).find(validDate);
}

/**
 * tryDetectors: String | undefined -> Array<[String, String] | null>
 * Coerces the clue to a string, then tries all detectors on it.
 * Each detector returns ["M-D", "Y"] if it matches or else null.
 */
function tryDetectors(clue) {
	return detectors.map((detector) => detector(String(clue)));
}

/**
 * Patterns to look for dates, in order of preference. These
 * are based on date formats that I've encountered on Are.na.
 * The browser's Date() parser is used to handle month names,
 * so that other languages might be supported. Hopefully I'd
 * like to also accommodate non-Gregorian dates and day-month
 * ordering, but I'm not sure yet of the best way to do this.
 * The AHA style comes after watching a talk by Sandi Metz.
 */

const detectors = [
	(clue) => {
		// 20330122 or 2033.01.22 or 2033/01/22 or 2024-07-21T18:37:59.078Z
		const match =
			clue.match(/^(\d{4})(\d{2})(\d{2})/) ||
			clue.match(/^(\d{4})-(\d{2})-(\d{2})/) ||
			clue.match(/^(\d{4})\/(\d{2})\/(\d{2})/) ||
			clue.match(/^(\d{4})\.(\d{2})\.(\d{2})/);
		if (!match) return null;
		const month = trimLeadingZero(match[2]);
		const day = trimLeadingZero(match[3]);
		const year = match[1];
		return [`${month}-${day}`, year];
	},
	(clue) => {
		// 1-22-33 or 01-22-2033 or 01.22.2033 or 1/22/2023
		const match =
			clue.match(/^(\d{1,2})-(\d{1,2})-(\d{2,4})/) ||
			clue.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2,4})/) ||
			clue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
		if (!match) return null;
		const month = trimLeadingZero(match[1]);
		const day = trimLeadingZero(match[2]);
		const year = addMillenium(match[3]);
		return [`${month}-${day}`, year];
	},
	(clue) => {
		// 33.01.22 or 330122
		const match =
			clue.match(/^(\d{2})(\d{2})(\d{2})/) ||
			clue.match(/^(\d{2})\.(\d{2})\.(\d{2})/) ||
			clue.match(/^(\d{2})-(\d{2})-(\d{2})/) ||
			clue.match(/^(\d{2})\/(\d{2})\/(\d{2})/);
		if (!match) return null;
		const month = trimLeadingZero(match[2]);
		const day = trimLeadingZero(match[3]);
		const year = addMillenium(match[1]);
		return [`${month}-${day}`, year];
	},
	(clue) => {
		// January 22, 2033
		const match = clue.match(/([A-Za-z]{3,12}),? ?(\d{1,2})\W{0,2}(\d{4})/);
		if (!match) return null;
		const date = new Date(match[0]);
		const month = date.getMonth() + 1;
		if (!month) return null;
		const day = trimLeadingZero(match[2]);
		const year = match[3];
		return [`${month}-${day}`, year];
	},
	(clue) => {
		// 22 January 2033
		const match = clue.match(/(\d{1,2}) ?([A-Za-z]{3,12}),? ?(\d{2,4})/);
		if (!match) return null;
		const date = new Date(match[0]);
		const month = date.getMonth() + 1;
		if (!month) return null;
		const day = trimLeadingZero(match[1]);
		const year = addMillenium(match[3]);
		return [`${month}-${day}`, year];
	},
];

/**
 * Descriptive Utilities
 */

function trimLeadingZero(str) {
	if (str.startsWith("0")) return str.slice(1);
	return str;
}

function addMillenium(str) {
	if (str.length === 2) return `20${str}`;
	return str;
}

const emptyYear = {
	days: new Map(),
	info: {
		yearsRepresented: new Set(),
		blockIds: new Set(),
	},
};

const validDates = buildDates();
export function validDate(x) {
    return Boolean(x) && validDates.includes(x[0]);
}

function buildDates() {
	const dates = [];
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
		[12, 31],
	];

	for (let i = 1; i <= months.length; i++) {
		for (let j = 1; j <= months[i - 1][1]; j++) {
			dates.push(`${i}-${j}`);
		}
	}
	return dates;
}


