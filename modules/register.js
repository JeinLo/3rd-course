import { register } from './api.js'
import { saveUserToStorage } from './auth.js'
import { renderLogin } from './login.js'

export function renderRegister({ onRegisterSuccess }) {
    const app = document.querySelector('#app')
    if (!app) {
        console.error('Элемент #app не найден в DOM')
        return
    }

    app.innerHTML = `
        <div class="container">
            <h1>Страница регистрации</h1>
            <div class="register-form">
                <input type="text" id="login-input" placeholder="Логин" />
                <input type="text" id="name-input" placeholder="Имя" />
                <input type="password" id="password-input" placeholder="Пароль" />
                <button id="register-button">Зарегистрироваться</button>
                <p>Уже есть аккаунт? <a href="#" id="to-login">Войти</a></p>
                <div id="error-message" style="color: red;"></div>
            </div>
        </div>
    `

    const loginInput = document.querySelector('#login-input')
    const nameInput = document.querySelector('#name-input')
    const passwordInput = document.querySelector('#password-input')
    const registerButton = document.querySelector('#register-button')
    const errorMessage = document.querySelector('#error-message')
    const toLoginLink = document.querySelector('#to-login')

    registerButton.addEventListener('click', async () => {
        const loginValue = loginInput.value.trim()
        const nameValue = nameInput.value.trim()
        const passwordValue = passwordInput.value.trim()

        if (!loginValue || !nameValue || !passwordValue) {
            errorMessage.textContent = 'Заполните все поля'
            return
        }

        try {
            const response = await register(
                loginValue,
                passwordValue,
                nameValue,
            )
            const user = {
                login: response.user.login,
                name: response.user.name,
                token: response.user.token,
            }
            saveUserToStorage(user)
            onRegisterSuccess()
        } catch (error) {
            errorMessage.textContent = error.message || 'Ошибка регистрации'
        }
    })

    toLoginLink.addEventListener('click', (e) => {
        e.preventDefault()
        renderLogin({ onLoginSuccess: onRegisterSuccess })
    })
}
