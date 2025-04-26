console.log('main.js loaded successfully')

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
        console.error('Ошибка загрузки комментариев:', error)
        alert('Не удалось загрузить комментарии')
    } finally {
        loadingIndicator.classList.add('hidden')
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting app')

    const nameInput = document.querySelector('.add-form-name')
    const commentInput = document.querySelector('.add-form-text')
    const commentList = document.querySelector('.comments')
    const addForm = document.querySelector('.add-form')
    const loadingIndicator = document.querySelector('#loading-indicator')
    const loadingMessage = document.querySelector('#loading-message')

    renderComments(commentList)
    loadComments(commentList, loadingIndicator).then(() => {
        console.log('Event listeners added')
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
