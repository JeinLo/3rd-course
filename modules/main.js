import { renderComments } from './render.js'
import { initAddCommentListener } from './listeners.js'

document.addEventListener('DOMContentLoaded', () => {
    initAddCommentListener()
    renderComments()
})
