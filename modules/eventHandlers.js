import { addComment } from './comments.js';
import renderComments from './renderComments.js';

export const addEventListeners = (addCommentCallback) => {
  const addButton = document.querySelector('.add-form-button');
  const nameInput = document.querySelector('.add-form-name');
  const textInput = document.querySelector('.add-form-text');

  addButton.addEventListener('click', () => {
    const name = nameInput.value;
    const text = textInput.value;

    if (name && text) {
      addComment(name, text);
      renderComments(comments);
      nameInput.value = '';
      textInput.value = '';
    }
  });
};
