import { loginUser, registerUser } from './api.js'

export const login = ({ container, onLoginSuccess }) => {
    container.innerHTML = `
        <form class="auth-form">
            <h2>Вход</h2>
            <input type="text" id="login-input" placeholder="Логин" autocomplete="username" required />
            <input type="password" id="password-input" placeholder="Пароль" autocomplete="current-password" required />
            <button type="submit" id="login-button">Войти</button>
        </form>
        <div class="error-message" style="color: red;"></div>
    `

    const form = container.querySelector('.auth-form')
    const loginInput = container.querySelector('#login-input')
    const passwordInput = container.querySelector('#password-input')
    const errorMessage = container.querySelector('.error-message')

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const login = loginInput.value.trim()
        const password = passwordInput.value.trim()

        if (!login || !password) {
            errorMessage.textContent = 'Заполните все поля'
            errorMessage.style.display = 'block'
            return
        }

        loginUser(login, password)
            .then((response) => {
                localStorage.setItem('authToken', response.user.token)
                localStorage.setItem('userName', response.user.name)
                onLoginSuccess()
            })
            .catch((error) => {
                errorMessage.textContent = error.message || 'Ошибка входа'
                errorMessage.style.display = 'block'
            })
    })
}

export const register = ({ container, onRegisterSuccess }) => {
    container.innerHTML = `
        <form class="auth-form">
            <h2>Регистрация</h2>
            <input type="text" id="login-input" placeholder="Логин" autocomplete="username" required />
            <input type="text" id="name-input" placeholder="Имя" autocomplete="name" required />
            <input type="password" id="password-input" placeholder="Пароль" autocomplete="new-password" required />
            <button type="submit" id="register-button">Зарегистрироваться</button>
        </form>
        <div class="error-message" style="color: red;"></div>
    `

    const form = container.querySelector('.auth-form')
    const loginInput = container.querySelector('#login-input')
    const nameInput = container.querySelector('#name-input')
    const passwordInput = container.querySelector('#password-input')
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
            .then((response) => {
                localStorage.setItem('authToken', response.user.token)
                localStorage.setItem('userName', response.user.name)
                onRegisterSuccess()
            })
            .catch((error) => {
                errorMessage.textContent = error.message || 'Ошибка регистрации'
                errorMessage.style.display = 'block'
            })
    })
}
