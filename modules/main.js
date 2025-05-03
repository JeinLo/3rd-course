import { fetchComments } from './api.js'
import { renderComments } from './render.js'
import {
    initAddCommentListener,
    initLikeListeners,
    initListenerReplyToComment,
} from './listeners.js'

const loadComments = async (commentList, loadingIndicator) => {
    loadingIndicator.classList.remove('hidden')
    try {
        await fetchComments()
        renderComments(commentList)
    } catch (error) {
        if (error.message === 'Ошибка сервера') {
            alert('Сервер сломался, попробуй позже')
        } else if (
            error.message ===
            'Кажется, у вас сломался интернет, попробуйте позже'
        ) {
            alert(error.message)
        } else {
            alert('Не удалось загрузить комментарии')
        }
    } finally {
        loadingIndicator.classList.add('hidden')
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.querySelector('.add-form-name')
    const commentInput = document.querySelector('.add-form-text')
    const commentList = document.querySelector('.comments')
    const addForm = document.querySelector('.add-form')
    const loadingIndicator = document.querySelector('#loading-indicator')
    const loadingMessage = document.querySelector('#loading-message')

    renderComments(commentList)
    loadComments(commentList, loadingIndicator).then(() => {
        initAddCommentListener(
            commentList,
            commentInput,
            nameInput,
            addForm,
            loadingMessage,
        )
        initLikeListeners(commentList)
        initListenerReplyToComment(commentList, commentInput)
    })
})
