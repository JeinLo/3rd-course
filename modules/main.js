import { renderComments } from './render.js'
import { initAddCommentListener } from './listeners.js'
import { fetchComments } from './api.js'

document.addEventListener('DOMContentLoaded', async () => {
    await fetchComments()
    renderComments()
    initAddCommentListener()
})
