import { fetchComments, postComment } from './api.js'
import { renderCommentsPage } from './render.js'
import { login, register } from './auth.js'

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container')
    if (!container) {
        console.error('Container not found')
        return
    }

    const token = localStorage.getItem('authToken')
    const userName = localStorage.getItem('userName')

    renderCommentsPage({
        container,
        token,
        userName,
        onLogin: () => {
            container.innerHTML = ''
            login({
                container,
                onSuccess: () =>
                    renderCommentsPage({
                        container,
                        token: localStorage.getItem('authToken'),
                        userName: localStorage.getItem('userName'),
                    }),
            })
        },
        onRegister: () => {
            container.innerHTML = ''
            register({
                container,
                onSuccess: () =>
                    renderCommentsPage({
                        container,
                        token: localStorage.getItem('authToken'),
                        userName: localStorage.getItem('userName'),
                    }),
            })
        },
        onPostComment: (text) => {
            const loadingIndicator =
                container.querySelector('.adding-indicator')
            const addForm = container.querySelector('.add-form')
            if (loadingIndicator) loadingIndicator.style.display = 'block'
            if (addForm) addForm.style.opacity = '0'

            postComment(text)
                .then(() => {
                    return fetchComments()
                })
                .then(() => {
                    renderCommentsPage({ container, token, userName })
                })
                .catch((error) => {
                    alert(error.message || 'Не удалось отправить комментарий')
                })
                .finally(() => {
                    if (loadingIndicator)
                        loadingIndicator.style.display = 'none'
                    if (addForm) addForm.style.opacity = '1'
                })
        },
    })
})
