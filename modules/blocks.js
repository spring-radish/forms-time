function findTemplate(block) {
    switch (block.class) {
        case 'Text':
            return `<div class="words">${block.content_html}</div>`
        case 'Image':
            return `<img src="${block.image.thumb.url}" alt="${block.title}" loading="lazy">`
        case 'Link':
            return `<a href="${block.source.url}" target="_blank" class="words">
                ${block.title || block.source.title}
                </a>`
        case 'Media':
            return `<a href="${block.source.url}" target="_blank" class="words">
                ${block.title || block.source.title}
                </a>`
        case 'Attachment':
            return `<a href="${block.attachment.url}" target="_blank">
                <img src="${block.image.thumb.url}" alt="${block.title}">
                </a>`
        case 'Channel':
            return `<a href="//are.na/${block.user.slug}/${block.slug}" target="_blank" class="words">
                ${block.title} by ${block.user.full_name}
                </a>`
    }
}

export function renderDay(blocks, date) {
    if (blocks.length === 0) return `<li id="${date}"></li>`

    blocks.sort((a, b) => a.fullyear - b.fullyear)

    const previewInner = blocks.map(block => 
        `<div class='preview ${block.class.toLowerCase()}'></div>`)
        .join('')
    const preview = `<a href="#inner-${date}">${previewInner}</a>`

    const articleInner = blocks.map(block =>
        `<section class="${block.class.toLowerCase()}">
            <a class="block" href="//are.na/block/${block.id}" target="_blank">${block.fullyear}</a> 
            ${findTemplate(block)}
        </section>`)
        .join('')
    const article = `<article class="content" id="inner-${date}">
        <header>
            <date>${date}</date> 
            <a href="#circumstances" class="close">close</a>
        </header>
        ${articleInner}
        </article>`

    return `<li id="${date}">${preview} ${article}</li>`
}