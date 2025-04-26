import { comments } from './comments.js'

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
                    <div>${comment.name}</div>
                    <div>${comment.date}</div>
                </div>
                <div class="comment-body">
                    <div class="comment-text">${comment.text}</div>
                </div>
                <div class="comment-footer">
                    <div class="likes">
                        <span class="likes-counter">${comment.likes}</span>
                        <button class="like-button ${comment.isLiked ? '-active-like' : ''}" data-index="${index}"></button>
                    </div>
                </div>
            </li>
        `,
        )
        .join('')
}
