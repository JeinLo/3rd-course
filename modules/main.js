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

    document
        .getElementById('comment-button')
        ?.addEventListener('click', handleCommentSubmit)
    document
        .getElementById('login-button')
        ?.addEventListener('click', handleLogin)
    document
        .getElementById('register-button')
        ?.addEventListener('click', handleRegister)
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

function handleLogin() {
    const login = document.getElementById('login-input').value.trim()
    const password = document.getElementById('password-input').value.trim()
    if (!login || !password) {
        alert('Заполните все поля')
        return
    }
    loginUser(login, password)
        .then((data) => {
            user = { name: data.user.name, token: data.user.token }
            localStorage.setItem('authToken', user.token)
            localStorage.setItem('userName', user.name)
            renderComments(comments, user)
        })
        .catch((err) => alert(err.message))
}

function handleRegister() {
    const login = document.getElementById('login-input').value.trim()
    const name = document.getElementById('name-input').value.trim()
    const password = document.getElementById('password-input').value.trim()
    if (!login || !name || !password) {
        alert('Заполните все поля')
        return
    }
    registerUser(login, name, password)
        .then((data) => {
            user = { name: data.user.name, token: data.user.token }
            localStorage.setItem('authToken', user.token)
            localStorage.setItem('userName', user.name)
            renderComments(comments, user)
        })
        .catch((err) => alert(err.message))
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
