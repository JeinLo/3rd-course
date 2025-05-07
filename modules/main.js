import { fetchComments } from './api.js'
import { renderComments } from './render.js'
import {
    initAddCommentListener,
    initLikeListeners,
    initListenerReplyToComment,
} from './listeners.js'
import { renderLogin } from './login.js'
import { getUserFromStorage } from './auth.js'

const loadComments = async (
    commentList,
    loadingIndicator,
    maxRetries = 3,
    retryDelay = 2000,
) => {
    loadingIndicator.classList.remove('hidden')
    let attempts = 0

    while (attempts < maxRetries) {
        try {
            await fetchComments()
            renderComments(commentList)
            return
        } catch (error) {
            attempts++
            if (error.message === 'Ошибка сервера') {
                if (attempts === maxRetries) {
                    alert('Сервер сломался, попробуй позже')
                    break
                }
                await new Promise((resolve) => setTimeout(resolve, retryDelay))
            } else if (
                error.message ===
                'Кажется, у вас сломался интернет, попробуйте позже'
            ) {
                alert(error.message)
                break
            } else {
                alert('Не удалось загрузить комментарии')
                break
            }
        } finally {
            loadingIndicator.classList.add('hidden')
        }
    }
}

export function renderApp() {
    const app = document.querySelector('#app')
    if (!app) {
        console.error('Элемент #app не найден в DOM')
        return
    }

    const user = getUserFromStorage()
    app.innerHTML = `
        <div class="container">
            <ul class="comments"></ul>
            <div id="loading-indicator" class="hidden">Загрузка...</div>
            <div id="loading-message" class="hidden">Комментарий добавляется...</div>
            ${
                user
                    ? `
                        <div class="add-form">
                            <input type="text" class="add-form-name" value="${user.name}" readonly />
                            <textarea class="add-form-text" placeholder="Введите ваш комментарий"></textarea>
                            <div class="add-form-row">
                                <button class="add-form-button">Написать</button>
                            </div>
                        </div>
                    `
                    : `
                        <p>Чтобы добавить комментарий, <a href="#" id="to-login">авторизуйтесь</a>.</p>
                    `
            }
        </div>
    `

    const commentList = document.querySelector('.comments')
    const loadingIndicator = document.querySelector('#loading-indicator')
    const toLoginLink = document.querySelector('#to-login')

    if (toLoginLink) {
        toLoginLink.addEventListener('click', (e) => {
            e.preventDefault()
            renderLogin({ onLoginSuccess: renderApp })
        })
    }

    loadComments(commentList, loadingIndicator).then(() => {
        initLikeListeners(commentList)
        initListenerReplyToComment(
            commentList,
            document.querySelector('.add-form-text'),
        )

        if (user) {
            initAddCommentListener(
                commentList,
                document.querySelector('.add-form-text'),
                document.querySelector('.add-form-name'),
                document.querySelector('.add-form'),
                document.querySelector('#loading-message'),
                user.token,
            )
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {
    const app = document.querySelector('#app')
    if (!app) {
        console.error('Элемент #app не найден в DOM при загрузке страницы')
        document.body.innerHTML = '<div id="app"></div>'
    }
    renderApp()
})
