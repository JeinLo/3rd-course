import { comments } from './comments.js';
import { renderComments } from './renderComments.js';

export function toggleLike(index, commentList) {
    const comment = comments[index];
    comment.liked = !comment.liked;
    comment.likes += comment.liked ? 1 : -1;
    renderComments(commentList);
}
