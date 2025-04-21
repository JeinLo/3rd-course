import { comments } from './comments.js'
import { postComment } from './api.js'
import { renderComments } from './render.js'

export async function addComment() {
    const nameInput = document.querySelector('.add-form-name')
    const commentInput = document.querySelector('.add-form-text')

    const name = nameInput.value.trim()
    const text = commentInput.value.trim()

    if (!name || !text) {
        alert('Пожалуйста, заполните оба поля!')
        return
    }

    const newComment = {
        name,
        text,
        likes: 0,
        isLiked: false,
    }

    await postComment(newComment)

    nameInput.value = ''
    commentInput.value = ''

    renderComments()
}
