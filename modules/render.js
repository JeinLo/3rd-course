import { sanitizeHTML } from './sanitize.js'

export const renderComments = (comments, user) => {
    const commentsList = document.getElementById('comments-list')
    if (!commentsList) return

    commentsList.innerHTML = comments
        .map(
            (comment, index) => `
            <li class="comment" data-index="${index}">
                <div class="comment-header">
                    <span>${sanitizeHTML(comment.name)}</span>
                    <span>${new Date(comment.date).toLocaleString()}</span>
                </div>
                <div class="comment-body">
                    <p>${sanitizeHTML(comment.text)}</p>
                </div>
                <div class="comment-footer">
                    <div class="likes">
                        <button class="like-button ${comment.isLiked ? '-active-like' : ''}" data-index="${index}">❤️</button>
                        <span class="likes-counter">${comment.likes}</span>
                    </div>
                </div>
            </li>
        `,
        )
        .join('')

    const commentForm = document.getElementById('comment-form')
    if (commentForm) {
        commentForm.style.display = user ? 'block' : 'none'
        const userNameSpan = document.getElementById('user-name')
        if (userNameSpan && user) {
            userNameSpan.textContent = user.name
            userNameSpan.readOnly = true
        }
    }

    const authContainer = document.getElementById('auth-form-container')
    if (authContainer) {
        authContainer.style.display = user ? 'none' : 'block'
    }

    const logoutButton = document.getElementById('logout-button')
    if (logoutButton) {
        logoutButton.style.display = user ? 'block' : 'none'
    }
}

export const renderLoginForm = () => {
    const container = document.getElementById('auth-form-container')
    if (!container) return

    container.innerHTML = `
        <form class="auth-form">
            <h2>Авторизация / Регистрация</h2>
            <input type="text" id="login-input" placeholder="Логин" autocomplete="username" required />
            <input type="text" id="name-input" placeholder="Имя (для регистрации)" autocomplete="name" required />
            <input type="password" id="password-input" placeholder="Пароль" autocomplete="current-password" required />
            <button type="submit" id="login-button">Войти</button>
            <button type="submit" id="register-button">Зарегистрироваться</button>
            <div class="error-message" style="color: red;"></div>
        </form>
    `
}
