export function escapeHTML(str) {
    const div = document.createElement('div')
    div.innerText = str
    return div.innerHTML
}
