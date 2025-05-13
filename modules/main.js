import {
    fetchComments,
    postComment,
    loginUser,
    registerUser,
    likeComment,
} from './api.js'
import { renderComments, renderLoginForm } from './render.js'
import { sanitizeHTML } from './sanitize.js'

let comments = []
let user = null

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken')
    const userName = localStorage.getItem('userName')
    if (token && userName) {
        user = { name: userName, token }
    }

    initApp()

    if (!user) {
        renderLoginForm()
    }

    // --- Обработчики событий ---
    const authForm = document.querySelector('.auth-form')
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault()
            const login = document.getElementById('login-input')?.value.trim()
            const name = document.getElementById('name-input')?.value.trim()
            const password = document
                .getElementById('password-input')
                ?.value.trim()

            const isLoginButton = e.submitter?.id === 'login-button'
            const isRegisterButton = e.submitter?.id === 'register-button'

            if (isLoginButton) {
                handleLogin(login, password)
            } else if (isRegisterButton) {
                handleRegister(login, name, password)
            }
        })
    }

    document
        .getElementById('comment-button')
        ?.addEventListener('click', handleCommentSubmit)
    document
        .getElementById('logout-button')
        ?.addEventListener('click', handleLogout)
    document
        .getElementById('login-required')
        ?.addEventListener('click', (e) => {
            e.preventDefault()
            document.getElementById('auth-form-container').style.display =
                'block'
        })

    addLikeEventListeners()
})

function initApp() {
    fetchComments()
        .then((fetchedComments) => {
            comments = fetchedComments
            renderComments(comments, user)
        })
        .catch((err) => alert('Не удалось загрузить комментарии'))
}

function handleCommentSubmit() {
    const text = document.getElementById('comment-text').value.trim()
    if (!text) {
        alert('Комментарий не может быть пустым')
        return
    }
    postComment(text)
        .then(() => {
            document.getElementById('comment-text').value = ''
            return fetchComments()
        })
        .then((newComments) => {
            comments = newComments
            renderComments(comments, user)
        })
        .catch((err) => alert(err.message))
}

function handleLogin(login, password) {
    if (!login || !password) {
        showErrorMessage('Введите логин и пароль')
        return
    }

    loginUser(login, password)
        .then((response) => {
            const user = {
                name: response.user.name,
                token: response.user.token,
            }
            localStorage.setItem('authToken', user.token)
            localStorage.setItem('userName', user.name)
            renderComments(comments, user)
        })
        .catch((error) => {
            showErrorMessage(error.message || 'Ошибка авторизации')
        })
}

function handleRegister(login, name, password) {
    if (!login || !name || !password) {
        showErrorMessage('Заполните все поля')
        return
    }

    registerUser(login, name, password)
        .then((response) => {
            const user = {
                name: response.user.name,
                token: response.user.token,
            }
            localStorage.setItem('authToken', user.token)
            localStorage.setItem('userName', user.name)
            renderComments(comments, user)
        })
        .catch((error) => {
            showErrorMessage(error.message || 'Ошибка регистрации')
        })
}

function handleLogout() {
    user = null
    localStorage.removeItem('authToken')
    localStorage.removeItem('userName')
    renderComments(comments, user)
    renderLoginForm()
}

function addLikeEventListeners() {
    document.querySelectorAll('.like-button').forEach((button) => {
        button.addEventListener('click', async (event) => {
            const index = parseInt(event.target.dataset.index, 10)
            const token = localStorage.getItem('authToken')

            if (!token) {
                alert('Требуется авторизация для лайков')
                return
            }

            try {
                const updatedData = await likeComment(comments[index].id, token)
                comments[index].likes = updatedData.likes
                comments[index].isLiked = !comments[index].isLiked
                renderComments(comments, user)
            } catch (error) {
                alert(error.message)
            }
        })
    })
}

function showErrorMessage(message) {
    const errorMessage = document.querySelector('.error-message')
    if (errorMessage) {
        errorMessage.textContent = message
        errorMessage.style.display = 'block'
    }
}
