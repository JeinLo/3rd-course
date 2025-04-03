import { comments } from './comments.js';
import { renderComments } from './render.js';
import { escapeHTML } from './utils.js';

export function initListenerAddComment() {
    const addCommentButton = document.getElementById('addCommentButton');
    addCommentButton.addEventListener('click', () => {
        const nameInput = document.getElementById('name');
        const commentInput = document.getElementById('comment');

        comments.push({
            name: escapeHTML(nameInput.value),
            date: new Date().toLocaleString(),
            text: escapeHTML(commentInput.value),
            likes: 0,
            liked: false,
        });

        nameInput.value = '';
        commentInput.value = '';
        renderComments();
    });
}

export function initListenerReplyToComment() {
    const commentList = document.getElementById('commentList');

    commentList.addEventListener('click', (event) => {
        const commentElement = event.target.closest('.comment');
        if (commentElement) {
            const index = commentElement.getAttribute('data-index');
            const comment = comments[index];
            const nameInput = document.getElementById('name');
            const commentInput = document.getElementById('comment');

            commentInput.value = `${comment.name}: "${comment.text}" `;
            nameInput.value = '';
            commentInput.focus();
        }
    });
}

export function initListenerLikes() {
    const commentList = document.getElementById('commentList');

    commentList.addEventListener('click', (event) => {
        if (event.target.classList.contains('like-button')) {
            const index = event.target.getAttribute('data-index');
            toggleLike(index);
        }
    });
}
//Лайки
function toggleLike(index) {
    const comment = comments[index];
    const wasLiked = comment.liked;
    comment.liked = !comment.liked;
    comment.likes += comment.liked ? 1 : -1;

    if (wasLiked !== comment.liked) {
        renderComments();
    }
}

function renderComments() {
    const commentsContainer = document.getElementById('comments-container');
    commentsContainer.innerHTML = '';

    comments.forEach((comment, index) => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
          <strong>${escapeHTML(comment.name)}</strong>
          <p>${escapeHTML(comment.text)}</p>
          <small>${comment.date}</small>
          <button class="like-button" data-index="${index}">
              ${comment.liked ? '❤️' : '🤍'} ${comment.likes}
          </button>
          <button onclick="editComment(${index})">Изменить</button>
      `;
        commentsContainer.appendChild(commentElement);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderComments();
    initListenerLikes();
});
