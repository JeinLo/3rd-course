import { initLikeListeners, initListenerReplyToComment } from './listeners.js'

export function addEventListeners(
    comments,
    commentList,
    commentInput,
    nameInput,
    renderComments,
) {
    initLikeListeners(commentList, renderComments)
    initListenerReplyToComment(commentList, commentInput)
}
