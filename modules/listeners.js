export function initLikeListeners(commentList, renderComments) {
    commentList.addEventListener('click', (event) => {
        const likeButton = event.target.closest('.like-button')
        if (!likeButton) return

        event.stopPropagation()

        const index = parseInt(likeButton.dataset.index, 10)
        if (isNaN(index) || index < 0 || index >= comments.length) {
            console.error('Неверный индекс для комментария:', index)
            return
        }

        const comment = comments[index]
        if (comment.isLiked) {
            comment.likes -= 1
            comment.isLiked = false
        } else {
            comment.likes += 1
            comment.isLiked = true
        }

        renderComments(commentList)
    })
}
