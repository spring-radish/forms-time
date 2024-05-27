function findTemplate(block) {
    switch (block.class) {
        case 'Text':
            return block.content_html
        case 'Image':
            return `<img src="${block.image.thumb.url}" alt="${block.title}">`
        case 'Link':
            return `<a href="${block.source.url}" target="_blank">
                ${block.title}
                </a>`
        case 'Media':
            return `<a href="${block.source.url}" target="_blank">
                ${block.title}
                </a>`
        case 'Attachment':
            return `<a href="${block.attachment.url}" target="_blank">
                <img src="${block.image.thumb.url}" alt="${block.title}">
                </a>`
        case 'Channel':
            return `<a href="are.na/${block.slug}" target="_blank">
                ${block.title} by ${block.user.full_name}
                </a>`
    }
}

export function renderDay(blocks, date) {
    if (blocks.length === 0) return `<li id="${date}"></li>`

    const previewInner = blocks.map(block => 
        `<div class='preview ${block.class.toLowerCase()}'></div>`)
        .join('')
    const preview = `<a href="#inner-${date}">${previewInner}</a>`

    const articleInner = blocks.map(block =>
        `<section>${findTemplate(block)}</section>`)
        .join('')
    const article = `<article class="content" id="inner-${date}">
        ${date} <a href="#circumstances" class="close">Close</a>
        ${articleInner}
        </article>`

    return `<li id="${date}">${preview} ${article}</li>`
}

//<li>
    // <a href="#19846">
    //     <div class="preview text"></div>
    //     <div class="preview link"></div>
    // </a>
    // <article class="content" id="19846">
    //     Thu May 02 2024<br>
    //     <a href="#grid-19846" class="close">Close</a>
    //     <section><hr><p>latenight lightning meditation</p></section>
    //     <section><hr>
    //         <a href="https://www.contemporaryartdaily.com/project/sean-raspet-at-jessica-silverman-san-francisco-8769" target="_blank">
    //             Sean Raspet at Jessica Silverman, San Francisco
    //         </a>
    //     </section>
    // </article>
// <li>