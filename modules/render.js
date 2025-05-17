import { sanitizeHTML } from './sanitize.js'

export const renderComments = (comments, user) => {
    const commentsList = document.getElementById('comments-list')
    const commentForm = document.getElementById('comment-form')
    const authContainer = document.getElementById('auth-form-container')
    const logoutButton = document.getElementById('logout-button')
    const loginRequired = document.getElementById('login-required')

    if (!commentsList) return

    // Рендерим список комментариев
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
                    <span>Лайки: ${comment.likes}</span>
                    <span>${comment.isLiked ? '❤️' : '🤍'}</span>
                </div>
            </li>
        `,
        )
        .join('')

    // Управляем видимостью элементов
    if (user) {
        // Пользователь авторизован
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
        // Пользователь не авторизован
        commentsList.style.display = 'block'
        commentForm.style.display = 'none'
        authContainer.style.display = 'none' // Скрываем по умолчанию
        logoutButton.style.display = 'none'
        loginRequired.style.display = 'block'
    }
}

export const renderLoginForm = () => {
    const container = document.getElementById('auth-form-container')
    if (!container) return

    container.innerHTML = `
        <form class="auth-form">
            <h2>Авторизация / Регистрация</h2>
            <input type="text" id="login-input" placeholder="Логин" autocomplete="username" required />
            <input type="text" id="name-input" placeholder="Имя (для регистрации)" required />
            <input type="password" id="password-input" placeholder="Пароль" autocomplete="current-password" required />
            <button type="submit" id="login-button">Войти</button>
            <button type="submit" id="register-button">Зарегистрироваться</button>
        </form>
        <div class="error-message" style="color: red;"></div>
    `
}
