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
            const formattedComments = responseData.comments.map((comment) => ({
                name: comment.author?.name || 'Anonymous',
                date: comment.date || getCurrentDateTime(),
                text: comment.text || '',
                likes: comment.likes || 0,
                isLiked: comment.isLiked || false,
            }))

            comments.length = 0
            comments.push(...formattedComments)
            return comments
        })
        .catch((error) => {
            console.error('Ошибка загрузки:', error)
            throw error
        })
}

export const postComment = (text, name) => {
    return fetch(`${host}/comments`, {
        method: 'POST',
        body: JSON.stringify({
            text,
            name,
        }),
    })
        .then((res) => {
            if (!res.ok) {
                return res.json().then((errorData) => {
                    throw new Error(
                        errorData.error || `Ошибка сервера: ${res.status}`,
                    )
                })
            }
            return res.json()
        })
        .then(() => fetchComments())
        .catch((error) => {
            console.error('Ошибка при отправке комментария:', error)
            throw error
        })
}
