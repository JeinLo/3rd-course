import { loadAndRenderComments } from './main.js'

const authHost = 'https://wedev-api.sky.pro/api/user'

export const renderRegister = ({ container, onRegisterSuccess }) => {
    container.innerHTML = `
        <h1>Регистрация</h1>
        <form class="register-form">
            <input type="text" class="register-form-login" placeholder="Логин" required autocomplete="username" />
            <input type="text" class="register-form-name" placeholder="Имя" required autocomplete="name" />
            <input type="password" class="register-form-password" placeholder="Пароль" required autocomplete="new-password" />
            <button type="submit" class="register-form-button">Зарегистрироваться</button>
        </form>
        <div class="error-message" style="display: none; color: #ff3333; text-align: center; margin-top: 10px;"></div>
    `

    const form = container.querySelector('.register-form')
    const loginInput = container.querySelector('.register-form-login')
    const nameInput = container.querySelector('.register-form-name')
    const passwordInput = container.querySelector('.register-form-password')
    const errorMessage = container.querySelector('.error-message')

    form.addEventListener('submit', (event) => {
        event.preventDefault()

        const login = loginInput.value.trim()
        const name = nameInput.value.trim()
        const password = passwordInput.value.trim()

        if (!login || !name || !password) {
            errorMessage.textContent = 'Заполните все поля'
            errorMessage.style.display = 'block'
            return
        }

        fetch(authHost, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login, name, password }),
        })
            .then(async (res) => {
                const responseText = await res.text()
                if (!res.ok) {
                    let errorData = {}
                    try {
                        errorData = JSON.parse(responseText)
                    } catch (e) {
                        console.error('Не удалось разобрать ответ:', e)
                    }
                    throw new Error(errorData.error || `Ошибка: ${res.status}`)
                }
                return JSON.parse(responseText)
            })
            .then((data) => {
                localStorage.setItem('authToken', data.user.token)
                localStorage.setItem('userName', data.user.name)
                onRegisterSuccess()
                loadAndRenderComments()
            })
            .catch((error) => {
                console.error('Ошибка регистрации:', error)
                errorMessage.textContent =
                    error.message || 'Не удалось зарегистрироваться'
                errorMessage.style.display = 'block'
            })
    })
}
