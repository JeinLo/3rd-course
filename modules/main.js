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
            document.getElementById('auth-form-container').style.display =
                'block'
            document.getElementById('comments-list').style.display = 'none'
            document.getElementById('comment-form').style.display = 'none'
            document.getElementById('logout-button').style.display = 'none'
            document.getElementById('login-required').style.display = 'none'
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
    const isCurrentlyLiked = likeButton.classList.contains('-active-like')
    likeButton.disabled = true
    likeButton.classList.toggle('-active-like')
    likeButton.querySelector('span').textContent = isCurrentlyLiked
        ? '🤍'
        : '❤️'

    likeComment(commentId)
        .then((response) => {
            console.log(
                'Like request successful for comment:',
                commentId,
                'Response:',
                response,
            )
            comments = comments.map((comment) =>
                comment.id === commentId
                    ? {
                          ...comment,
                          likes: isCurrentlyLiked
                              ? comment.likes - 1
                              : comment.likes + 1,
                          isLiked: !isCurrentlyLiked,
                      }
                    : comment,
            )
            renderComments(comments, user)
        })
        .catch((err) => {
            likeButton.classList.toggle('-active-like')
            likeButton.querySelector('span').textContent = isCurrentlyLiked
                ? '❤️'
                : '🤍'
            console.error('Like error:', err.message, 'Comment ID:', commentId)
            if (err.message.includes('Требуется авторизация')) {
                alert('Ваша сессия истекла. Пожалуйста, войдите снова.')
                handleLogout()
            } else {
                alert(err.message || 'Ошибка при обработке лайка')
            }
        })
        .finally(() => {
            likeButton.disabled = false
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
            return fetchComments()
        })
        .then((fetchedComments) => {
            console.log('Comments after login:', fetchedComments)
            comments = fetchedComments
            const commentsList = document.getElementById('comments-list')
            if (commentsList) {
                commentsList.style.display = 'block'
            }
            renderComments(comments, user)
        })
        .catch((error) => {
            console.error('Login error:', error.message)
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
            return fetchComments()
        })
        .then((fetchedComments) => {
            console.log('Comments after register:', fetchedComments)
            comments = fetchedComments
            const commentsList = document.getElementById('comments-list')
            if (commentsList) {
                commentsList.style.display = 'block'
            }
            renderComments(comments, user)
        })
        .catch((error) => {
            console.error('Register error:', error.message)
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
