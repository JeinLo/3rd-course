import { delay } from './utils.js'

export function addEventListeners(
    comments,
    commentList,
    commentInput,
    renderComments,
) {
    commentList.removeEventListener('click', handleClick)
    commentList.addEventListener('click', handleClick)

    function handleClick(event) {
        const button = event.target.closest('.like-button')
        if (button) {
            event.stopPropagation()
            const index = parseInt(button.dataset.index, 10)
            console.log(
                'Clicked like button, index:',
                index,
                'isLiked before:',
                comments[index].isLiked,
            )

            const token = localStorage.getItem('authToken')
            if (!token) {
                alert('Требуется авторизация для лайков')
                return
            }

            if (comments[index].isLikeLoading) {
                console.log('Like is already processing for index:', index)
                return
            }

            comments[index].isLikeLoading = true
            button.classList.add('-loading-like')
            renderComments(commentList, commentInput)

            delay(2000).then(() => {
                comments[index].isLiked = !comments[index].isLiked
                comments[index].likes += comments[index].isLiked ? 1 : -1
                comments[index].isLikeLoading = false
                button.classList.remove('-loading-like')

                console.log(
                    'isLiked after:',
                    comments[index].isLiked,
                    'likes:',
                    comments[index].likes,
                )
                renderComments(commentList, commentInput)
            })

            return
        }

        const commentEl = event.target.closest('.comment')
        if (commentEl) {
            const index = parseInt(commentEl.dataset.index, 10)
            console.log('Clicked comment, index:', index)
            const comment = comments[index]
            if (commentInput) {
                commentInput.value = `> ${comment.text}\n${commentInput.value}`
                commentInput.focus()
            }
        }
    }

    console.log('Event listeners added, comments count:', comments.length)
}
