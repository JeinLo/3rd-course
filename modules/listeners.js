import { comments } from './comments.js'
import { postComment } from './api.js'
import { renderComments } from './render.js'

function delay(interval = 300) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, interval)
    })
}

export function initAddCommentListener(
    commentList,
    commentInput,
    nameInput,
    addForm,
    loadingMessage,
) {
    const addButton = document.querySelector('.add-form-button')

    const handlePostClick = async () => {
        const name = nameInput.value.trim()
        const text = commentInput.value.trim()

        if (name.length < 3 || text.length < 3) {
            alert('Имя и комментарий должны быть не короче 3 символов')
            return
        }

        addForm.style.display = 'none'
        loadingMessage.classList.remove('hidden')
        addButton.disabled = true

        try {
            await postComment(text, name)
            renderComments(commentList)
            nameInput.value = ''
            commentInput.value = ''
        } catch (error) {
            if (error.message === 'Ошибка сервера') {
                alert('Сервер сломался, попробуй позже')
                handlePostClick()
            } else {
                alert(error.message || 'Не удалось отправить комментарий')
            }
        } finally {
            addForm.style.display = 'block'
            loadingMessage.classList.add('hidden')
            addButton.disabled = false
        }
    }

    addButton.addEventListener('click', handlePostClick)
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
    commentList.addEventListener('click', async (event) => {
        const likeButton = event.target.closest('.like-button')
        if (likeButton) {
            event.stopPropagation()

            const index = parseInt(likeButton.dataset.index, 10)
            if (isNaN(index) || index < 0 || index >= comments.length) {
                console.error('Неверный индекс для комментария:', index)
                return
            }

            const comment = comments[index]
            if (!comment || comment.isLikeLoading) {
                return
            }

            comment.isLikeLoading = true
            renderComments(commentList)

            try {
                await delay(2000)
                comment.likes = comment.isLiked
                    ? comment.likes - 1
                    : comment.likes + 1
                comment.isLiked = !comment.isLiked
                comment.isLikeLoading = false
                renderComments(commentList)
            } catch (error) {
                console.error('Ошибка при обработке лайка:', error)
                comment.isLikeLoading = false
                renderComments(commentList)
                alert('Не удалось обновить лайк')
            }
        }
    })
}
