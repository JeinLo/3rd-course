import { comments } from './comments.js'
import { addComment } from './addComment.js'
import { renderComments } from './render.js'

export function initAddCommentListener() {
    const addButton = document.querySelector('.add-form-button')

    addButton.addEventListener('click', async () => {
        await addComment()
    })
}

export function initListenerReplyToComment() {
    const commentList = document.querySelector('.comments')
    const commentInput = document.querySelector('.add-form-text')

    const commentsElements = commentList.querySelectorAll('.comment')

    for (const comment of commentsElements) {
        comment.addEventListener('click', (event) => {
            const index = event.currentTarget.dataset.index
            const currentComment = comments[index]
            const name = currentComment.name
            const text = currentComment.text

            commentInput.value = `> ${name}: ${text}\n`
        })
    }
}

export function initLikeListeners() {
    const commentList = document.querySelector('.comments')
    const likeButtons = commentList.querySelectorAll('.like-button')

    for (const likeButton of likeButtons) {
        likeButton.addEventListener('click', (event) => {
            event.stopPropagation()

            const index = likeButton.dataset.index
            const comment = comments[index]

            if (comment.isLiked) {
                comment.likes -= 1
            } else {
                comment.likes += 1
            }
            comment.isLiked = !comment.isLiked

            renderComments()
        })
    }
}
