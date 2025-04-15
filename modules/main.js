import { renderComments } from './render.js'
import { initAddCommentListener } from './listeners.js'
import { fetchComments, postComment } from './api.js'

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Загружаем комментарии из API
        await fetchComments()

        // Начальные комментарии
        const initialComments = [
            {
                name: 'Глеб Фокин',
                text: 'Это будет первый комментарий на этой странице',
                likes: 3,
                isLiked: false,
            },
            {
                name: 'Варвара Н.',
                text: 'Мне нравится как оформлена эта страница! ❤',
                likes: 75,
                isLiked: true,
            },
        ]

        const comments = await fetchComments()
        if (comments.length === 0) {
            console.log('API пуст, добавляем начальные комментарии')
            for (const comment of initialComments) {
                await postComment(comment)
            }
        }

        renderComments()
        initAddCommentListener()
    } catch (error) {
        console.error('Ошибка при инициализации приложения:', error)
        alert('Не удалось загрузить комментарии. Попробуйте позже.')
        renderComments()
    }
})
