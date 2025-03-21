import { comments, addComment } from './modules/comments.js';
import renderComments from './modules/renderComments.js';
import { addEventListeners } from './modules/eventHandlers.js';

const init = () => {
  renderComments(comments);
  addEventListeners(addComment);
};

init();
