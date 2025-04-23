console.log('main.js loaded successfully')

import { fetchComments, postComment } from './api.js'
import { renderComments } from './render.js'
import { comments } from './comments.js'
import {
    initAddCommentListener,
    initLikeListeners,
    initListenerReplyToComment,
} from './listeners.js'

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting app')

    const nameInput = document.querySelector('.add-form-name')
    const commentInput = document.querySelector('.add-form-text')
    const commentList = document.querySelector('.comments')

    fetchComments()
        .then((loadedComments) => {
            renderComments(commentList, commentInput, nameInput)
            console.log('Event listeners added')
            initAddCommentListener(commentList, commentInput, nameInput)
            initLikeListeners(commentList, commentInput, nameInput)
            initListenerReplyToComment(commentList, commentInput)
        })
        .catch((error) => {
            console.error('Ошибка загрузки комментариев:', error)
            alert('Не удалось загрузить комментарии')
            renderComments(commentList, commentInput, nameInput)
        })
})
