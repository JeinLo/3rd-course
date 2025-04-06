import { comments } from './comments.js'
import { escapeHTML } from './utils.js'

export function renderComments() {
    const commentList = document.getElementById('commentList')
    commentList.innerHTML = ''

    comments.forEach((comment, index) => {
        const commentHTML = `
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
                        <button class="like-button" data-index="${index}"></button>
                    </div>
                </div>
            </li>
        `
        commentList.innerHTML += commentHTML
    })

    initListenerLikes(renderComments)
    initListenerReplyToComment()
}
