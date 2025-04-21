import { comments } from './comments.js'
import { sanitizeHTML } from './sanitize.js'

export function renderComments(commentList) {
    commentList.innerHTML = comments
        .map((comment, index) => {
            const date = new Date(comment.date)
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(
                date.getMonth() + 1
            )
                .toString()
                .padStart(2, '0')}.${date.getFullYear() % 100} ${date
                .getHours()
                .toString()
                .padStart(
                    2,
                    '0',
                )}:${date.getMinutes().toString().padStart(2, '0')}`
            return `
                <li class="comment" data-index="${index}">
                    <div class="comment-header">
                        <div>${sanitizeHTML(comment.name)}</div>
                        <div>${formattedDate}</div>
                    </div>
                    <div class="comment-body">
                        <div class="comment-text">${sanitizeHTML(comment.text)}</div>
                    </div>
                    <div class="comment-footer">
                        <div class="likes">
                            <span class="likes-counter">${comment.likes}</span>
                            <button class="like-button ${
                                comment.isLiked ? '-active-like' : ''
                            }" data-index="${index}"></button>
                        </div>
                    </div>
                </li>
            `
        })
        .join('')
}
