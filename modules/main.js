import { renderComments } from './render.js'
import { initAddCommentListener } from './listeners.js'
import { fetchComments } from './api.js'

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await fetchComments()
        renderComments()
        initAddCommentListener()
    } catch (error) {
        console.error('Ошибка при инициализации приложения:', error)
        alert('Не удалось загрузить комментарии. Попробуйте позже.')
        renderComments()
    }
})
