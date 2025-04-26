import { comments } from './comments.js'
import { getCurrentDateTime } from './utils.js'

const host = 'https://wedev-api.sky.pro/api/v1/baranova-evgeniya'

export const fetchComments = () => {
    return fetch(`${host}/comments`, {
        method: 'GET',
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error(
                    `Ошибка при загрузке комментариев: ${res.status}`,
                )
            }
            return res.json()
        })
        .then((responseData) => {
            console.log('Comments from server:', responseData.comments)

            const formattedComments = responseData.comments.map((comment) => ({
                name: comment.author?.name || 'Anonymous',
                date: comment.date || getCurrentDateTime(),
                text: comment.text || '',
                likes: comment.likes || 0,
                isLiked: comment.isLiked || false,
            }))

            comments.length = 0
            comments.push(...formattedComments)
            console.log('Обновленный массив комментариев:', comments)

            return comments
        })
        .catch((error) => {
            console.error('Ошибка загрузки:', error)
            throw error
        })
}

export const postComment = (text, name) => {
    console.log('API sending:', { text, name })
    return fetch(`${host}/comments`, {
        method: 'POST',
        body: JSON.stringify({
            text,
            name,
        }),
    })
        .then((res) => {
            if (!res.ok) {
                if (res.status === 400) {
                    return res.json().then((errorData) => {
                        console.log('Server error response:', errorData)
                        throw new Error(errorData.error)
                    })
                }
                throw new Error(
                    `Ошибка сервера при отправке комментария: ${res.status}`,
                )
            }
            return res.json()
        })
        .then(() => fetchComments())
}
