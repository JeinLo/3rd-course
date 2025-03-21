import { comments } from './comments.js';

const renderComments = (comments) => {
  const commentsList = document.querySelector('.comments');
  commentsList.innerHTML = ''; // Очистить список перед рендерингом

  comments.forEach(comment => {
    const commentItem = document.createElement('li');
    commentItem.classList.add('comment');
    commentItem.innerHTML = `
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
          <button class="like-button">Нравится</button>
        </div>
      </div>
    `;
    commentsList.appendChild(commentItem);
  });
};

export default renderComments;
