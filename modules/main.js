console.log('main.js is loaded')

import { fetchComments, postComment } from './api.js'
import { renderCommentsPage } from './render.js'
import { login, register } from './auth.js'

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM is fully loaded')
    const container = document.querySelector('.container')
    if (!container) {
        console.error('Container not found in DOM')
        return
    }

    const token = localStorage.getItem('authToken')
    const userName = localStorage.getItem('userName')

    console.log(
        'Rendering comments page with token:',
        !!token,
        'userName:',
        userName,
    )

    renderCommentsPage({
        container,
        token,
        userName,
        onLogin: () => {
            console.log('Login link clicked')
            container.innerHTML = ''
            login({
                container,
                onSuccess: () => {
                    console.log('Login successful, re-rendering page') // Лог для отладки
                    renderCommentsPage({
                        container,
                        token: localStorage.getItem('authToken'),
                        userName: localStorage.getItem('userName'),
                    })
                },
            })
        },
        onRegister: () => {
            console.log('Register link clicked')
            container.innerHTML = ''
            register({
                container,
                onSuccess: () => {
                    console.log('Register successful, re-rendering page') // Лог для отладки
                    renderCommentsPage({
                        container,
                        token: localStorage.getItem('authToken'),
                        userName: localStorage.getItem('userName'),
                    })
                },
            })
        },
        onPostComment: (text) => {
            console.log('Posting comment:', text)
            const loadingIndicator =
                container.querySelector('.adding-indicator')
            const addForm = container.querySelector('.add-form')
            if (loadingIndicator) loadingIndicator.style.display = 'block'
            if (addForm) addForm.style.opacity = '0'

            postComment(text)
                .then(() => {
                    console.log(
                        'Comment posted successfully, fetching updated comments',
                    )
                    return fetchComments()
                })
                .then(() => {
                    console.log('Re-rendering comments page after posting')
                    renderCommentsPage({ container, token, userName })
                })
                .catch((error) => {
                    console.error('Error posting comment:', error)
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
