// api.js
import { comments } from './comments.js'
import { getCurrentDateTime } from './utils.js'

const API_URL = 'https://wedev-api.sky.pro/api/v1/baranova-evgeniya/comments'

export async function fetchComments() {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
        })

        if (!response.ok) {
            throw new Error(
                `Ошибка при загрузке комментариев: ${response.status}`,
            )
        }

        const data = await response.json()
        const commentsFromApi = data.comments

        const formattedComments = commentsFromApi.map((comment) => ({
            name: comment.author.name || 'Anonymous',
            date: comment.date || getCurrentDateTime(),
            text: comment.text || '',
            likes: comment.likes || 0,
            isLiked: false,
        }))

        comments.length = 0
        comments.push(...formattedComments)

        return formattedComments
    } catch (error) {
        console.error('Ошибка при загрузке комментариев:', error)

        return []
    }
}

export async function postComment(comment) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: comment.text,
                name: comment.name,
            }),
        })

        if (!response.ok) {
            throw new Error(
                `Ошибка при добавлении комментария: ${response.status}`,
            )
        }

        const data = await response.json()
        const newComment = {
            name: data.name || 'Anonymous',
            date: data.date || getCurrentDateTime(),
            text: data.text || '',
            likes: 0,
            isLiked: false,
        }

        comments.push(newComment)
        return newComment
    } catch (error) {
        console.error('Ошибка при добавлении комментария:', error)
        throw error
    }
}
