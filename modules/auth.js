import { loginUser, registerUser } from './api.js'
import { sanitizeHTML } from './sanitize.js' // Импортируем из sanitize.js

export const login = ({ container, onSuccess }) => {
    container.innerHTML = `
        <h1>Вход</h1>
        <form class="auth-form">
            <input type="text" class="auth-form-login" placeholder="Логин" required />
            <input type="password" class="auth-form-password" placeholder="Пароль" required />
            <button type="submit">Войти</button>
        </form>
        <div class="error-message" style="display: none;"></div>
    `

    const form = container.querySelector('.auth-form')
    const loginInput = container.querySelector('.auth-form-login')
    const passwordInput = container.querySelector('.auth-form-password')
    const errorMessage = container.querySelector('.error-message')

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const login = loginInput.value.trim()
        const password = passwordInput.value.trim()

        if (!login || !password) {
            errorMessage.textContent = 'Введите логин и пароль'
            errorMessage.style.display = 'block'
            return
        }

        loginUser(login, password)
            .then((data) => {
                localStorage.setItem('authToken', data.user.token)
                localStorage.setItem('userName', data.user.name)
                onSuccess()
            })
            .catch((error) => {
                errorMessage.textContent = sanitizeHTML(
                    error.message || 'Не удалось авторизоваться',
                )
                errorMessage.style.display = 'block'
            })
    })
}

export const register = ({ container, onSuccess }) => {
    container.innerHTML = `
        <h1>Регистрация</h1>
        <form class="auth-form">
            <input type="text" class="auth-form-login" placeholder="Логин" required />
            <input type="text" class="auth-form-name" placeholder="Имя" required />
            <input type="password" class="auth-form-password" placeholder="Пароль" required />
            <button type="submit">Зарегистрироваться</button>
        </form>
        <div class="error-message" style="display: none;"></div>
    `

    const form = container.querySelector('.auth-form')
    const loginInput = container.querySelector('.auth-form-login')
    const nameInput = container.querySelector('.auth-form-name')
    const passwordInput = container.querySelector('.auth-form-password')
    const errorMessage = container.querySelector('.error-message')

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const login = loginInput.value.trim()
        const name = nameInput.value.trim()
        const password = passwordInput.value.trim()

        if (!login || !name || !password) {
            errorMessage.textContent = 'Заполните все поля'
            errorMessage.style.display = 'block'
            return
        }

        registerUser(login, name, password)
            .then((data) => {
                localStorage.setItem('authToken', data.user.token)
                localStorage.setItem('userName', data.user.name)
                onSuccess()
            })
            .catch((error) => {
                errorMessage.textContent = sanitizeHTML(
                    error.message || 'Не удалось зарегистрироваться',
                )
                errorMessage.style.display = 'block'
            })
    })
}
