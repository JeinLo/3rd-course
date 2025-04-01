import { comments } from './modules/comments.js';
import { renderComments } from './modules/render.js';
import { initListenerAddComment } from './modules/listeners.js';

renderComments(comments);
initListenerAddComment(comments);
