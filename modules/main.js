import {
    fetchComments,
    postComment,
    loginUser,
    registerUser,
    likeComment,
} from './api.js'
import {
    renderComments,
    renderLoginForm,
    renderRegisterForm,
} from './render.js'

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
        renderComments(comments, user)
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
            // Показываем форму авторизации
            document.getElementById('auth-form-container').style.display =
                'block'
            // Скрываем список комментариев
            document.getElementById('comments-list').style.display = 'none'
            // Скрываем форму добавления комментария
            document.getElementById('comment-form').style.display = 'none'
            // Скрываем кнопку "Выйти"
            document.getElementById('logout-button').style.display = 'none'
            // Скрываем текст "Чтобы добавить комментарий, авторизуйтесь"
            document.getElementById('login-required').style.display = 'none'
            // Рендерим форму логина
            renderLoginForm()
            setupFormHandlers()
        })

    document
        .getElementById('auth-form-container')
        .addEventListener('click', (e) => {
            if (e.target.id === 'switch-to-register') {
                e.preventDefault()
                renderRegisterForm()
                setupFormHandlers()
            } else if (e.target.id === 'switch-to-login') {
                e.preventDefault()
                renderLoginForm()
                setupFormHandlers()
            }
        })

    // Обработчик кликов по лайкам
    document.getElementById('comments-list').addEventListener('click', (e) => {
        const likeButton = e.target.closest('.like-button')
        if (likeButton && user) {
            const commentId = likeButton.dataset.commentId
            handleLike(commentId, likeButton)
        } else if (likeButton && !user) {
            alert('Требуется авторизация для лайков')
        }
    })
})

function initApp() {
    fetchComments()
        .then((fetchedComments) => {
            comments = fetchedComments
            renderComments(comments, user)
        })
        .catch((err) => {
            alert('Не удалось загрузить комментарии')
        })
}

function setupFormHandlers() {
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
        .catch((err) => {
            alert(err.message || 'Ошибка отправки комментария')
        })
}

function handleLike(commentId, likeButton) {
    // Сохраняем текущее состояние
    const isCurrentlyLiked = likeButton.classList.contains('-active-like')
    const originalText = likeButton.textContent

    // Локально обновляем массив comments
    const comment = comments.find((c) => c.id === commentId)
    if (comment) {
        comment.isLiked = !isCurrentlyLiked
        comment.likes = isCurrentlyLiked ? comment.likes - 1 : comment.likes + 1
        // Перерисовываем сразу, чтобы сердечко "застывало"
        renderComments(comments, user)
    }

    likeComment(commentId)
        .then(() => fetchComments())
        .then((newComments) => {
            comments = newComments
            renderComments(comments, user)
        })
        .catch((err) => {
            if (comment) {
                comment.isLiked = isCurrentlyLiked
                comment.likes = isCurrentlyLiked
                    ? comment.likes + 1
                    : comment.likes - 1
            }
            likeButton.classList.toggle('-active-like')
            likeButton.textContent = originalText
            renderComments(comments, user)
            alert(err.message || 'Ошибка при обработке лайка')
        })
}

function handleLogin(login, password) {
    if (!login || !password) {
        showErrorMessage('Заполните все поля')
        return
    }

    loginUser(login, password)
        .then((response) => {
            user = {
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
            user = {
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
}

function showErrorMessage(message) {
    const errorMessage = document.querySelector('.error-message')
    if (errorMessage) {
        errorMessage.textContent = message
        errorMessage.style.display = 'block'
    }
}
