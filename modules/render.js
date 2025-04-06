import { comments } from './comments.js'
import { initLikeListeners, initListenerReplyToComment } from './listeners.js'
import { escapeHTML } from './utils.js'

export const renderComments = () => {
    const commentList = document.querySelectorAll('.comments')

    commentList.innerHTML = comments.forEach((comment, index) => {
        return `
            <li class="comment" data-index="${index}">
                <div class="comment-header">
                    <div>${escapeHTML(comment.name)}</div>
                    <div>${comment.date}</div>
                </div>
                <div class="comment-body">
                    <div class="comment-text">
                        ${escapeHTML(comment.text)}
                    </div>
                </div>
                <div class="comment-footer">
                    <div class="likes">
                        <span class="likes-counter">${comment.likes}</span>
                        <button data-index="${index}" class="like-button ${comment.isLiked ? 'active-like' : ''}"> </button>
                    </div>
                </div>
            </li>
        `
    })

    initLikeListeners(renderComments)
    initListenerReplyToComment()
}
