import { comments } from './comments.js'
import { getCurrentDateTime } from './utils.js'
import { sanitizeHTML } from './sanitize.js'
import { renderComments } from './render.js'

export function addComment() {
    const nameInput = document.querySelector('.add-form-name')
    const commentInput = document.querySelector('.add-form-text')
    const commentList = document.querySelector('.comments')

    console.log('addComment called with comments:', comments)

    if (!nameInput || !commentInput || !commentList) {
        console.error('Invalid DOM elements in addComment:', {
            nameInput,
            commentInput,
            commentList,
        })
        return
    }

    const name = sanitizeHTML(nameInput.value.trim())
    console.log('After sanitizeHTML (name):', name)

    const text = sanitizeHTML(commentInput.value.trim())
    console.log('After sanitizeHTML (text):', text)

    if (!name || !text) {
        alert('Пожалуйста, заполните оба поля!')
        return
    }

    const newComment = {
        name,
        date: getCurrentDateTime(),
        text,
        likes: 0,
        isLiked: false,
    }

    console.log('New comment:', newComment)

    comments.push(newComment)

    nameInput.value = ''
    commentInput.value = ''

    console.log('Comments after push:', comments)

    renderComments()
}
