import { comments } from './comments.js';
import { toggleLike } from './likeToggle.js';
import { escapeHTML } from './escapeHTML.js';

export function renderComments(commentList, nameInput, commentInput) {
    commentList.innerHTML = '';
    comments.forEach((comment, index) => {
        const likeClass = comment.liked ? '-active-like' : '';
        const commentHTML = `
            <li class="comment">
                <div class="comment-header">
                    <div>${escapeHTML(comment.name)}</div>
                    <div>${comment.date}</div>
                </div>
                <div class="comment-body" onclick="setReplyToComment(${index})">
                    <div class="comment-text">
                        ${escapeHTML(comment.text)}
                    </div>
                </div>
                <div class="comment-footer">
                    <div class="likes">
                        <span class="likes-counter">${comment.likes}</span>
                        <button class="like-button ${likeClass}" data-index="${index}"></button>
                    </div>
                </div>
            </li>
        `;
        commentList.innerHTML += commentHTML;
    });

    // Пример использования nameInput и commentInput
    if (nameInput && commentInput) {
        // Можно, например, добавить логику для отображения текущих значений
        console.log('Current Name Input:', nameInput.value);
        console.log('Current Comment Input:', commentInput.value);
    }

    document.querySelectorAll('.like-button').forEach((button) => {
        button.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            toggleLike(index, commentList);
        });
    });
}
