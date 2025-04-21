import { renderComments } from './render.js'
import {
    initAddCommentListener,
    initLikeListeners,
    initListenerReplyToComment,
} from './listeners.js'
import { fetchComments } from './api.js'

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await fetchComments()
        renderComments()
        initAddCommentListener()
        initLikeListeners()
        initListenerReplyToComment()
    } catch (error) {
        console.error('Ошибка при инициализации приложения:', error)
        alert('Не удалось загрузить комментарии. Попробуйте позже.')
        renderComments()
    }
})
