import { comments } from './comments.js'
import { getCurrentDateTime } from './utils.js'

const API_URL = 'https://wedev-api.sky.pro/api/v1/baranova-evgeniya/comments'

export async function fetchComments() {
    try {
        console.log('Отправляем GET-запрос на:', API_URL)
        const response = await fetch(API_URL, {
            method: 'GET',
        })

        console.log('Ответ от API (GET):', response)

        if (!response.ok) {
            throw new Error(
                `Ошибка при загрузке комментариев: ${response.status} ${response.statusText}`,
            )
        }

        const data = await response.json()
        console.log('Данные от API (GET):', data)

        if (!data.comments || !Array.isArray(data.comments)) {
            throw new Error(
                'Поле comments отсутствует или не является массивом',
            )
        }

        const formattedComments = data.comments.map((comment, index) => {
            console.log(`Обрабатываем комментарий ${index}:`, comment)
            return {
                name: comment.author?.name || 'Anonymous',
                date: comment.date || getCurrentDateTime(),
                text: comment.text || '',
                likes: comment.likes || 0,
                isLiked: false,
            }
        })

        comments.length = 0
        comments.push(...formattedComments)
        console.log('Форматированные комментарии:', formattedComments)

        return formattedComments
    } catch (error) {
        console.error('Ошибка при загрузке комментариев:', error.message)
        const localComments = [
            {
                name: 'Глеб Фокин',
                date: '12.02.22 12:18',
                text: 'Это будет первый комментарий на этой странице',
                likes: 3,
                isLiked: false,
            },
            {
                name: 'Варвара Н.',
                date: '13.02.22 19:22',
                text: 'Мне нравится как оформлена эта страница! ❤',
                likes: 75,
                isLiked: true,
            },
        ]
        comments.length = 0
        comments.push(...localComments)
        return localComments
    }
}

export async function postComment(comment) {
    try {
        console.log(
            'Отправляем POST-запрос на:',
            API_URL,
            'с данными:',
            comment,
        )
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: comment.text,
                author: comment.name,
                forceError: false,
            }),
        })

        console.log('Ответ от API (POST):', response)

        if (!response.ok) {
            const errorData = await response.json()
            console.log('Тело ответа с ошибкой:', errorData)
            throw new Error(
                `Ошибка при добавлении комментария: ${response.status} ${response.statusText}`,
            )
        }

        const data = await response.json()
        console.log('Данные от API после POST:', data)

        const newComment = {
            name: data.author?.name || data.name || 'Anonymous',
            date: data.date || getCurrentDateTime(),
            text: data.text || '',
            likes: 0,
            isLiked: false,
        }

        comments.push(newComment)
        console.log('Добавленный комментарий:', newComment)

        return newComment
    } catch (error) {
        console.error('Ошибка при добавлении комментария:', error.message)
        const newComment = {
            name: comment.name,
            date: getCurrentDateTime(),
            text: comment.text,
            likes: 0,
            isLiked: false,
        }
        comments.push(newComment)
        return newComment
    }
}
