import { comments } from './comments.js'
import { addComment } from './addComment.js'
import { renderComments } from './render.js'

export function initAddCommentListener() {
    const addButton = document.querySelector('.add-form-button')

    addButton.addEventListener('click', async () => {
        console.log('Кнопка "Написать" нажата')
        await addComment()
    })
}

export function initListenerReplyToComment() {
    const commentList = document.querySelector('.comments')
    const commentInput = document.querySelector('.add-form-text')

    commentList.addEventListener('click', (event) => {
        const commentElement = event.target.closest('.comment')
        if (commentElement) {
            const index = parseInt(commentElement.dataset.index, 10)
            const currentComment = comments[index]
            const name = currentComment.name
            const text = currentComment.text

            commentInput.value = `> ${name}: ${text}\n`
        }
    })
}

export function initLikeListeners() {
    const commentList = document.querySelector('.comments')

    commentList.addEventListener('click', (event) => {
        const likeButton = event.target.closest('.like-button')
        if (likeButton) {
            event.stopPropagation()

            const index = parseInt(likeButton.dataset.index, 10)
            console.log('Клик по кнопке лайка, индекс:', index)

            if (isNaN(index) || index < 0 || index >= comments.length) {
                console.error('Неверный индекс для комментария:', index)
                return
            }

            const comment = comments[index]
            if (!comment) {
                console.error('Комментарий не найден по индексу:', index)
                return
            }

            if (comment.isLiked) {
                comment.likes -= 1
                comment.isLiked = false
            } else {
                comment.likes += 1
                comment.isLiked = true
            }

            console.log('Обновленный комментарий:', comment)
            console.log('Массив comments:', comments)

            renderComments()
        }
    })
}
