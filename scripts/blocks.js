function findTemplate(block) {
    switch (block.type) {
        case 'Text':
            return `<div class="words">${block.content.html}</div>`
        case 'Image':
            if (block.image) {
                return `<img src="${block.image.small.src}" alt="${block.title}" loading="lazy">`
            } else {
                return `<a href="//are.na/block/${block.id}" target="_blank" class="words">
                ${block.title}
                </a>`
            }
        case 'Link':
            return `<a href="${block.source.url}" target="_blank" class="words">
                ${block.title || block.source.title}
                </a>`
        case 'Embed':
            if (block.image) {
                return `<a href="${block.source.url}" target="_blank">
                <img src="${block.image.small.src}" alt="${block.title}">
                </a>`
            } else {
                return `<a href="${block.source.url}" target="_blank" class="words">
                    ${block.title || block.embed.title}
                    </a>`
            }
        case 'Attachment':
            if (block.image) {
                return `<a href="${block.attachment.url}" target="_blank">
                <img src="${block.image.small.src}" alt="${block.title}">
                </a>`
            } else {
                return `<a href="${block.attachment.url}" target="_blank">
                ${block.title}
                </a>`
            }
        case 'Channel':
            return `<a href="//are.na/${block.owner.slug}/${block.slug}" target="_blank" class="words">
                ${block.title} by ${block.owner.name}
                </a>`
        case 'Connection':
            return `<a href=//are.na/block/${block.block_id} target="_blank">
                ${block.block_title}
                </a> 
                →
                <a href=//are.na/channel/${id} target="_blank">
                ${block.title}
                </a>`
    }
}

export function renderDay(blocks, date) {
    if (blocks.length === 0) return `<li id="${date}"></li>`

    blocks.sort((a, b) => a.fullyear - b.fullyear)

    const previewInner = renderPreviewParts(blocks)
    const delay = Math.random()
    const preview = `<a style="animation-delay:${delay}s" class="transom" href="#inner-${date}">${previewInner}</a>`

    const articleInner = renderArticleParts(blocks)
    const article = `<article class="content" id="inner-${date}">
        <header>
            <date>${date}</date> 
            <a href="#circumstances" class="close">close</a>
        </header>
        ${articleInner}
        </article>`

    return `${preview} ${article}`
}

export function renderPreviewParts(blocks) {
    const parts = blocks.map(block => 
        `<div class="preview ${block.type.toLowerCase()} year-${block.fullyear}"></div>`)
    return parts.join('')
}

export function renderArticleParts(blocks) {
    const parts = blocks.map(block =>
        `<section class="${block.type.toLowerCase()} year-${block.fullyear}">
            <a class="source" href="//are.na/block/${block.id}" target="_blank">${block.fullyear}</a> 
            ${findTemplate(block)}
        </section>`)
    return parts.join('')
}

// Year -> Set
export function getBlocksField(days, field) {
    const blocks = Array.from(days.values()).flat()
    return new Set(blocks.map(b => b[field]))
}