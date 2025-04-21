import { comments } from './comments.js'
import { postComment } from './api.js'
import { renderComments } from './render.js'

export async function addComment() {
    console.log('Функция addComment вызвана')

    const nameInput = document.querySelector('.add-form-name')
    const commentInput = document.querySelector('.add-form-text')

    const name = nameInput.value.trim()
    const text = commentInput.value.trim()

    console.log('Введенные данные:', { name, text })

    if (!name || !text) {
        console.log('Поля не заполнены, показываем alert')
        alert('Пожалуйста, заполните оба поля!')
        return
    }

    const newComment = {
        name,
        text,
        likes: 0,
        isLiked: false,
    }

    console.log('Создан новый комментарий:', newComment)

    try {
        await postComment(newComment)
        console.log('Комментарий успешно добавлен, очищаем поля ввода')
        nameInput.value = ''
        commentInput.value = ''
        console.log('Перерисовываем список комментариев')
        renderComments()
    } catch (error) {
        console.error('Ошибка при добавлении комментария:', error.message)
        alert(
            'Не удалось добавить комментарий в API. Комментарий добавлен локально.',
        )
        renderComments()
    }
}
