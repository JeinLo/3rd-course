import { comments } from './comments.js'
import { sanitizeHTML } from './sanitize.js'

export function renderComments(commentList) {
    if (!commentList) {
        console.error('Элемент .comments не найден в DOM')
        return
    }

    if (comments.length === 0) {
        commentList.innerHTML = '<li>Комментариев пока нет</li>'
        return
    }

    commentList.innerHTML = comments
        .map(
            (comment, index) => `
            <li class="comment" data-index="${index}">
                <div class="comment-header">
                    <div>${sanitizeHTML(comment.name)}</div>
                    <div>${sanitizeHTML(comment.date)}</div>
                </div>
                <div class="comment-body">
                    <div class="comment-text">${sanitizeHTML(comment.text)}</div>
                </div>
                <div class="comment-footer">
                    <div class="likes">
                        <span class="likes-counter">${comment.likes}</span>
                        <button class="like-button ${comment.isLiked ? '-active-like' : ''}" data-index="${index}">
                            <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.11 16.9482L11 17.0572L10.879 16.9482C5.654 12.2507 2.2 9.14441 2.2 5.99455C2.2 3.81471 3.85 2.17984 6.05 2.17984C7.744 2.17984 9.394 3.26975 9.977 4.75204H12.023C12.606 3.26975 14.256 2.17984 15.95 2.17984C18.15 2.17984 19.8 3.81471 19.8 5.99455C19.8 9.14441 16.346 12.2507 11.11 16.9482ZM15.95 0C14.036 0 12.199 0.882834 11 2.26703C9.801 0.882834 7.964 0 6.05 0C2.662 0 0 2.6267 0 5.99455C0 10.1035 3.74 13.4714 9.405 18.5613L11 20L12.595 18.5613C18.26 13.4714 22 10.1035 22 5.99455C22 2.6267 19.338 0 15.95 0Z" fill="#BCEC30"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </li>
        `,
        )
        .join('')
}
