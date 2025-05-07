import { login } from './api.js'
import { saveUserToStorage } from './auth.js'
import { renderRegister } from './register.js'

export function renderLogin({ onLoginSuccess }) {
    const app = document.querySelector('#app')
    if (!app) {
        console.error('Элемент #app не найден в DOM')
        return
    }

    app.innerHTML = `
        <div class="container">
            <h1>Страница входа</h1>
            <div class="login-form">
                <input type="text" id="login-input" placeholder="Логин" />
                <input type="password" id="password-input" placeholder="Пароль" />
                <button id="login-button">Войти</button>
                <p>Нет аккаунта? <a href="#" id="to-register">Зарегистрироваться</a></p>
                <div id="error-message" style="color: red;"></div>
            </div>
        </div>
    `

    const loginInput = document.querySelector('#login-input')
    const passwordInput = document.querySelector('#password-input')
    const loginButton = document.querySelector('#login-button')
    const errorMessage = document.querySelector('#error-message')
    const toRegisterLink = document.querySelector('#to-register')

    loginButton.addEventListener('click', async () => {
        const loginValue = loginInput.value.trim()
        const passwordValue = passwordInput.value.trim()

        if (!loginValue || !passwordValue) {
            errorMessage.textContent = 'Введите логин и пароль'
            return
        }

        try {
            const response = await login(loginValue, passwordValue)
            const user = {
                login: response.user.login,
                name: response.user.name,
                token: response.user.token,
            }
            saveUserToStorage(user)
            onLoginSuccess()
        } catch (error) {
            errorMessage.textContent = error.message || 'Ошибка входа'
        }
    })

    toRegisterLink.addEventListener('click', (e) => {
        e.preventDefault()
        renderRegister({ onRegisterSuccess: onLoginSuccess })
    })
}
