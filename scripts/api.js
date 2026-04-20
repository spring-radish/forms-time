const requestHistory = {
	channels: new Map(),
	users: new Map(),
	// blocks: new Map(),
};

export async function dispatchUrl(input) {
	const viewRoutes = ["channels", "blocks", "table", "index", "all"];

	const path = input // e.g. 'https://www.are.na/elliott-cost/model-sites/table/'
		.split("are.na") // -> ['https://www.', '/elliott-cost/model-sites/table/']
		.at(-1) // -> '/elliott-cost/model-sites/table/'
		.split("/") // -> ["", "elliott-cost", "model-sites", "table", ""]
		.filter((s) => s.length) // -> ["elliott-cost", "model-sites", "table"]
		.filter((s) => !viewRoutes.includes(s)); // -> ["elliott-cost", "model-sites"]

	const slug = path.at(-1);

	if (path[0] === "block") return requestBlock();

	switch (path.length) {
		case 1:
			return requestUser(slug);
		case 2:
			return requestChannel(slug);
		default:
			return requestEmpty();
	}
}

function requestEmpty() {
	return {
		message:
			"don't recognize this url... try copying from the address bar of a channel or user page",
		blocks: null,
	};
}

async function requestChannel(slug) {
	const sendChannelRequest = async function (slug, page = 1) {
		const url =
			"https://api.are.na/v3/channels/" +
			slug +
			"/contents" +
			"?per=" +
			100 +
			"&page=" +
			page;

		console.log("requesting page", page, "of", url);

		const response = await fetch(url);
		if (!response.ok) throw new Error(`http error: ${response.status}`);

		const channel = await response.json();
		return channel;
	};

	try {
		const slugHistory = requestHistory.channels.get(slug);
		const page = pickPage(slugHistory);
		const response = await sendChannelRequest(slug, page);

		console.log(response);

		const nextPage = response.meta.next_page;
		requestHistory.channels.set(slug, nextPage);

		return {
			message: `added page ${page} of channel ${slug}`,
			blocks: response.data,
		};
	} catch (exception) {
		return { message: exception.message, blocks: null };
	}
}

async function requestUser(slug) {
	const sendUserRequest = async function (slug, page = 1) {
		const url =
			"https://api.are.na/v3/users/" +
			slug +
			"/contents" +
			"?per=" +
			100 +
			"&sort=created_at_desc" +
			"&page=" +
			page;

		console.log("requesting page", page, "of", url);

		const response = await fetch(url);
		if (!response.ok) throw new Error(`http error: ${response.status}`);

		const user = await response.json();
		return user;
	};

	try {
		const slugHistory = requestHistory.users.get(slug);
		const page = pickPage(slugHistory);
		const response = await sendUserRequest(slug, page);

		const nextPage = response.meta.next_page;
		requestHistory.users.set(slug, nextPage);

		return { 
			message: `added page ${page} of user ${slug}`, 
			blocks: response.data,
		};
	} catch (exception) {
		return { message: exception.message, blocks: null };
	}
}

function requestBlock() {
	return {
		message:
			"i can’t show blocks... yet. if you know how to get all the connection dates for a block, hit my line",
		blocks: null,
	};
}

function pickPage(slugNextPage) {
	if (slugNextPage === undefined) return 1; // haven't yet seen this slug
	if (slugNextPage === null) throw new Error('no more data'); // no more pages
	return slugNextPage
}
