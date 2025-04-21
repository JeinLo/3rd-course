import { postComment } from './api.js'
import { renderComments } from './render.js'
import { sanitizeHTML } from './sanitize.js'

export async function addComment(nameInput, commentInput, commentList) {
    const name = sanitizeHTML(nameInput.value.trim())
    const text = sanitizeHTML(commentInput.value.trim())

    if (name.length < 3 || text.length < 3) {
        alert('Имя и текст должны содержать минимум 3 символа')
        return
    }

    try {
        await postComment(text, name)
        nameInput.value = ''
        commentInput.value = ''
        renderComments(commentList, commentInput, nameInput)
    } catch (error) {
        alert(error.message || 'Не удалось отправить комментарий')
    }
}
