export function sanitizeHTML(str) {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;')
}
