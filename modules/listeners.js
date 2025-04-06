import { comments } from './comments.js'
import { renderComments } from './render.js'
import { escapeHTML } from './utils.js'

export function initListenerReplyToComment() {
    const commentsElements = document.querySelectorAll('.comment')

    for (const comment of commentsElements) {
        comment.addEventListener('click', (event) => {
            const index = event.currentTarget.dataset.index
            const currentComment = comments[index]
            const name = currentComment.name
            const text = currentComment.text

            const input = document.getElementById('comment')
            input.value = `${name} - ${text}`
        })
    }
}

export const initLikeListeners = (renderComments) => {
    const likeButtons = document.querySelectorAll('.like-button')

    for (const likeButton of likeButtons) {
        likeButton.addEventListener('click', (event) => {
            event.stopPropagation()

            const index = likeButton.dataset.index
            const comment = comments[index]

            comment.likes - comment.isLiked
                ? comment.likes - 1
                : comment.likes + 1

            comment.isLikedlikes = !comment.isLiked

            renderComments()
        })
    }
}

export const initListenerAddComment = () => {
    const name = document.getElementById('name-input')
    const text = document.getElementById('text-input')

    const addButton = document.querySelector('.add-form-button')

    addButton.addEventListener('click', () => {
        if (!name.value || !text.value) {
            console.error('Заполните форму')
        }

        const newComment = {
            name: escapeHTML(name.value),
            date: new Date().toLocaleString(),
            text: escapeHTML(text.value),
            likes: 0,
            liked: false,
        }

        comments.push(newComment)

        renderComments()

        name.value = ''
        text.value = ''
    })
}
