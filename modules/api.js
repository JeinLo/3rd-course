import { comments } from './comments.js'
import { getCurrentDateTime } from './utils.js'

const host = 'https://wedev-api.sky.pro/api/v1/baranova-evgeniya'

export const fetchComments = () => {
    return fetch(`${host}/comments`, {
        method: 'GET',
    })
        .then((res) => {
            if (!res.ok) {
                if (res.status >= 500 && res.status < 600) {
                    throw new Error('Ошибка сервера')
                }
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
                isLikeLoading: false,
            }))

            comments.length = 0
            comments.push(...formattedComments)
            return comments
        })
        .catch((error) => {
            if (
                error.name === 'TypeError' &&
                error.message.includes('Failed to fetch')
            ) {
                throw new Error(
                    'Кажется, у вас сломался интернет, попробуйте позже',
                )
            }
            throw error
        })
}

export const postComment = (text, name) => {
    return fetch(`${host}/comments`, {
        method: 'POST',
        body: JSON.stringify({
            text,
            name,
            forceError: true,
    })
        .then((res) => {
            if (!res.ok) {
                if (res.status === 400) {
                    return res.json().then((errorData) => {
                        throw new Error(
                            errorData.error || 'Некорректные данные',
                        )
                    })
                }
                if (res.status >= 500 && res.status < 600) {
                    throw new Error('Ошибка сервера')
                }
                throw new Error(`Ошибка сервера: ${res.status}`)
            }
            return res.json()
        })
        .then(() => fetchComments())
        .catch((error) => {
            if (
                error.name === 'TypeError' &&
                error.message.includes('Failed to fetch')
            ) {
                throw new Error(
                    'Кажется, у вас сломался интернет, попробуйте позже',
                )
            }
            throw error
        })
}
