import { renderComments } from './render.js';
import { escapeHTML } from './escapeHTML.js';
import { comments } from './comments.js';

export function initListenerAddComment(comments) {
    const nameInput = document.getElementById('name');
    const commentInput = document.getElementById('comment');
    const addCommentButton = document.getElementById('addComment');

    addCommentButton.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const comment = commentInput.value.trim();

        if (!name || !comment) {
            alert('Пожалуйста, заполните оба поля.');
            return;
        }

        const currentDateTime = new Date();
        const formattedDate = currentDateTime.toLocaleString();

        comments.push({
            name: escapeHTML(name),
            date: formattedDate,
            text: escapeHTML(comment),
            likes: 0,
            liked: false,
        });

        nameInput.value = '';
        commentInput.value = '';
        renderComments(comments);
    });
}

export function initListenerLikes() {
    const commentList = document.getElementById('commentList');

    commentList.addEventListener('click', (event) => {
        const button = event.target.closest('.like-button');
        if (button) {
            const index = button.getAttribute('data-index');
            toggleLike(index);
        }
    });
}

function toggleLike(index) {
    const comment = comments[index];
    comment.liked = !comment.liked;
    comment.likes += comment.liked ? 1 : -1;
    renderComments(comments);
}

export function initListenerReplyToComment() {
    const commentList = document.getElementById('commentList');

    commentList.addEventListener('click', (event) => {
        const commentElement = event.target.closest('.comment-body');
        if (commentElement) {
            const index = commentElement
                .querySelector('.comment-text')
                .getAttribute('data-index');
            setReplyToComment(index);
        }
    });
}

function setReplyToComment(index) {
    const comment = comments[index];
    const nameInput = document.getElementById('name');
    const commentInput = document.getElementById('comment');

    nameInput.value = comment.name + ': ';
    commentInput.value = comment.text + ' ';
    commentInput.focus();
}
