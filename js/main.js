import { comments } from './comments.js';
import { renderComments } from './renderComments.js';
import { setReplyToComment } from './replyToComment.js';
document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
    const commentInput = document.getElementById('comment');
    const addCommentButton = document.getElementById('addComment');
    const commentList = document.getElementById('commentList');
    // Функция для добавления нового комментария
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
            name: name,
            date: formattedDate,
            text: comment,
            likes: 0,
            liked: false,
        });
        nameInput.value = '';
        commentInput.value = '';
        renderComments(commentList, nameInput, commentInput);
    });

    // Инициализация рендеринга комментариев
    renderComments(commentList, nameInput, commentInput);

    // Добавляем обработчик событий для комментариев
    commentList.addEventListener('click', (event) => {
        const commentElement = event.target.closest('.comment');
        if (commentElement) {
            const index = Array.from(commentList.children).indexOf(
                commentElement
            );
            setReplyToComment(index); // Вызов функции с индексом комментария
        }
    });
});
