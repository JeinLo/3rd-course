import { fetchComments, postComment } from './api.js'
import { renderComments } from './render.js'
import { comments, updateComments } from './comments.js'

document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.querySelector('.add-form-name')
    const commentInput = document.querySelector('.add-form-text')
    const addButton = document.querySelector('.add-form-button')
    const commentList = document.querySelector('.comments')

    renderComments(commentList)
    initEventListeners(commentList, commentInput)

    fetchComments()
        .then((loadedComments) => {
            updateComments(loadedComments)
            renderComments(commentList)
            initEventListeners(commentList, commentInput)
        })
        .catch(() => alert('Не удалось загрузить комментарии'))

    addButton.addEventListener('click', async () => {
        const name = nameInput.value.trim()
        const text = commentInput.value.trim()

        if (name.length < 3 || text.length < 3) {
            alert('Имя и текст должны содержать минимум 3 символа')
            return
        }

        addButton.disabled = true
        try {
            await postComment(text, name)
            updateComments(await fetchComments())
            renderComments(commentList)
            initEventListeners(commentList, commentInput)
            nameInput.value = ''
            commentInput.value = ''
        } catch (error) {
            alert(error.message || 'Не удалось отправить комментарий')
        } finally {
            addButton.disabled = false
        }
    })

    function initEventListeners(commentList, commentInput) {
        commentList.removeEventListener('click', handleClick)
        commentList.addEventListener('click', handleClick)

        function handleClick(event) {
            const likeButton = event.target.closest('.like-button')
            if (likeButton) {
                const index = parseInt(likeButton.dataset.index, 10)
                if (!isNaN(index) && index >= 0 && index < comments.length) {
                    const comment = comments[index]
                    comment.isLiked ? comment.likes-- : comment.likes++
                    comment.isLiked = !comment.isLiked
                    renderComments(commentList)
                    initEventListeners(commentList, commentInput)
                }
            }

            const commentElement = event.target.closest('.comment')
            if (commentElement) {
                const index = parseInt(commentElement.dataset.index, 10)
                if (!isNaN(index) && index >= 0 && index < comments.length) {
                    const comment = comments[index]
                    commentInput.value = `> ${comment.name}: ${comment.text}\n`
                    commentInput.focus()
                }
            }
        }
    }
})
