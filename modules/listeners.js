import { comments } from './comments.js'
import { postComment } from './api.js'
import { renderComments } from './render.js'

export function initAddCommentListener(
    commentList,
    commentInput,
    nameInput,
    addForm,
    loadingMessage,
) {
    const addButton = document.querySelector('.add-form-button')

    addButton.addEventListener('click', async () => {
        console.log('Кнопка "Написать" нажата')

        const name = nameInput.value.trim()
        const text = commentInput.value.trim()

        if (name.length < 3 || text.length < 3) {
            alert('Имя и текст должны содержать минимум 3 символа')
            return
        }

        addForm.classList.add('hidden')
        loadingMessage.classList.remove('hidden')
        addButton.disabled = true

        try {
            await postComment(text, name)
            renderComments(commentList)
            nameInput.value = ''
            commentInput.value = ''
        } catch (error) {
            console.error('Ошибка:', error)
            alert(error.message || 'Не удалось отправить комментарий')
        } finally {
            addForm.classList.remove('hidden')
            loadingMessage.classList.add('hidden')
            addButton.disabled = false
        }
    })
}

export function initListenerReplyToComment(commentList, commentInput) {
    commentList.addEventListener('click', (event) => {
        const commentElement = event.target.closest('.comment')
        if (commentElement) {
            if (event.target.closest('.like-button')) {
                return
            }

            event.stopPropagation()

            const index = parseInt(commentElement.dataset.index, 10)
            const currentComment = comments[index]
            const name = currentComment.name
            const text = currentComment.text

            commentInput.value = `> ${name}: ${text}\n`
        }
    })
}

export function initLikeListeners(commentList) {
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

            renderComments(commentList)
        }
    })
}
