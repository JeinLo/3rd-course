import { sanitizeHTML } from './sanitize.js'

export const renderComments = (comments, user) => {
    const commentsList = document.getElementById('comments-list')
    const commentForm = document.getElementById('comment-form')
    const authContainer = document.getElementById('auth-form-container')
    const logoutButton = document.getElementById('logout-button')
    const loginRequired = document.getElementById('login-required')

    if (!commentsList) return

    commentsList.innerHTML = comments
        .map(
            (comment) => `
            <li class="comment">
                <div class="comment-header">
                    <span>${sanitizeHTML(comment.name)}</span>
                    <span>${new Date(comment.date).toLocaleString()}</span>
                </div>
                <div class="comment-body">
                    <p>${sanitizeHTML(comment.text)}</p>
                </div>
                <div class="comment-footer">
                    <div class="likes">
                        <span class="likes-counter">Лайки: ${comment.likes}</span>
                        <button class="like-button ${comment.isLiked ? '-active-like' : ''}" data-comment-id="${comment.id}">
                            ${comment.isLiked ? '❤️' : '🤍'}
                        </button>
                    </div>
                </div>
            </li>
        `,
        )
        .join('')

    if (user) {
        commentsList.style.display = 'block'
        commentForm.style.display = 'block'
        authContainer.style.display = 'none'
        logoutButton.style.display = 'block'
        loginRequired.style.display = 'none'

        const userNameSpan = document.getElementById('user-name')
        if (userNameSpan) {
            userNameSpan.textContent = user.name
            userNameSpan.readOnly = true
        }
    } else {
        commentsList.style.display = 'block'
        commentForm.style.display = 'none'
        authContainer.style.display = 'none'
        logoutButton.style.display = 'none'
        loginRequired.style.display = 'block'
    }
}

export const renderLoginForm = () => {
    const container = document.getElementById('auth-form-container')
    if (!container) return

    container.innerHTML = `
        <form class="auth-form">
            <h2>Авторизация</h2>
            <input type="text" id="login-input" placeholder="Логин" autocomplete="username" required />
            <input type="password" id="password-input" placeholder="Пароль" autocomplete="current-password" required />
            <button type="submit" id="login-button">Войти</button>
        </form>
        <p>Нет аккаунта? <a href="#" id="switch-to-register" class="auth-form-switch">Зарегистрируйтесь</a></p>
        <div class="error-message" style="color: red;"></div>
    `
}

export const renderRegisterForm = () => {
    const container = document.getElementById('auth-form-container')
    if (!container) return

    container.innerHTML = `
        <form class="auth-form">
            <h2>Регистрация</h2>
            <input type="text" id="login-input" placeholder="Логин" autocomplete="username" required />
            <input type="text" id="name-input" placeholder="Имя" autocomplete="name" required />
            <input type="password" id="password-input" placeholder="Пароль" autocomplete="new-password" required />
            <button type="submit" id="register-button">Зарегистрироваться</button>
        </form>
        <p>Уже есть аккаунт? <a href="#" id="switch-to-login" class="auth-form-switch">Войдите</a></p>
        <div class="error-message" style="color: red;"></div>
    `
}
