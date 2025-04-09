import { comments } from './comments.js'
import { renderComments } from './render.js'

export function addEventListeners(
    commentList,
    nameInput,
    commentInput,
    renderCommentsFunc,
) {
    initListenerReplyToComment(commentList, commentInput)
    initLikeListeners(commentList, renderCommentsFunc, commentInput, nameInput)
}

export function initListenerReplyToComment(commentList, commentInput) {
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

export function initLikeListeners(
    commentList,
    renderCommentsFunc,
    commentInput,
    nameInput,
) {
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

            renderCommentsFunc(commentList, commentInput, nameInput)
        })
    }
}
