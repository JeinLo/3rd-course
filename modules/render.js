import { escapeHTML } from './escapeHTML.js';
import { initListenerLikes, initListenerReplyToComment } from './listeners.js';

export function renderComments(comments) {
    const commentList = document.getElementById('commentList');
    commentList.innerHTML = '';

    comments.forEach((comment, index) => {
        const likeClass = comment.liked ? '-active-like' : '';
        const commentHTML = `
            <li class="comment">
                <div class="comment-header">
                    <div>${escapeHTML(comment.name)}</div>
                    <div>${comment.date}</div>
                </div>
                <div class="comment-body">
                    <div class="comment-text" data-index="${index}">
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

    initListenerLikes();
    initListenerReplyToComment();
}
