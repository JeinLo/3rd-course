import { fetchComments } from './api.js'
import { sanitizeHTML } from './sanitize.js' // Импортируем из sanitize.js

export const renderCommentsPage = ({
    container,
    token,
    userName,
    onLogin,
    onRegister,
    onPostComment,
}) => {
    container.innerHTML = `
        <ul class="comments"></ul>
        <div class="loading-indicator">Загрузка комментариев...</div>
        <div class="auth-message" style="display: ${token ? 'none' : 'block'};">
            Чтобы добавить комментарий, 
            <a href="#" class="login-link">авторизуйтесь</a> или 
            <a href="#" class="register-link">зарегистрируйтесь</a>.
        </div>
        <form class="add-form" style="display: ${token ? 'block' : 'none'};">
            <input type="text" class="add-form-name" readonly value="${sanitizeHTML(userName || '')}" />
            <textarea class="add-form-text" placeholder="Введите ваш комментарий" rows="4"></textarea>
            <div class="add-form-row">
                <button class="add-form-button">Написать</button>
            </div>
        </form>
        <div class="adding-indicator" style="display: none;">Комментарий добавляется...</div>
    `

    const commentList = container.querySelector('.comments')
    const loadingIndicator = container.querySelector('.loading-indicator')
    const loginLink = container.querySelector('.login-link')
    const registerLink = container.querySelector('.register-link')
    const addForm = container.querySelector('.add-form')
    const commentInput = container.querySelector('.add-form-text')

    // Загрузка комментариев
    fetchComments()
        .then((comments) => {
            if (comments.length === 0) {
                commentList.innerHTML = '<li>Комментариев пока нет</li>'
            } else {
                commentList.innerHTML = comments
                    .map(
                        (comment, index) => `
                    <li class="comment" data-index="${index}">
                        <div class="comment-header">
                            <div>${sanitizeHTML(comment.name)}</div>
                            <div>${sanitizeHTML(comment.date)}</div>
                        </div>
                        <div class="comment-body">
                            <div class="comment-text">${sanitizeHTML(comment.text)}</div>
                        </div>
                        <div class="comment-footer">
                            <div class="likes">
                                <span class="likes-counter">${comment.likes}</span>
                                <button class="like-button ${comment.isLiked ? '-active-like' : ''}" data-index="${index}"></button>
                            </div>
                        </div>
                    </li>
                `,
                    )
                    .join('')
            }
        })
        .catch((error) => {
            alert(error.message || 'Не удалось загрузить комментарии')
        })
        .finally(() => {
            if (loadingIndicator) loadingIndicator.style.display = 'none'
        })

    // Обработчики событий
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault()
            onLogin()
        })
    }

    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault()
            onRegister()
        })
    }

    if (addForm) {
        addForm.addEventListener('submit', (e) => {
            e.preventDefault()
            const text = commentInput.value.trim()
            if (text.length < 3) {
                alert('Комментарий должен быть не короче 3 символов')
                return
            }
            onPostComment(text)
            commentInput.value = ''
        })
    }

    // Лайки и ответы на комментарии
    commentList.addEventListener('click', (e) => {
        const likeButton = e.target.closest('.like-button')
        if (likeButton) {
            const index = parseInt(likeButton.dataset.index, 10)
            fetchComments().then((comments) => {
                if (!token) {
                    alert('Требуется авторизация для лайков')
                    return
                }
                comments[index].isLiked = !comments[index].isLiked
                comments[index].likes += comments[index].isLiked ? 1 : -1
                renderCommentsPage({
                    container,
                    token,
                    userName,
                    onLogin,
                    onRegister,
                    onPostComment,
                })
            })
            return
        }

        const commentEl = e.target.closest('.comment')
        if (commentEl && commentInput) {
            const index = parseInt(commentEl.dataset.index, 10)
            fetchComments().then((comments) => {
                const comment = comments[index]
                commentInput.value = `> ${comment.text}\n${commentInput.value}`
                commentInput.focus()
            })
        }
    })
}
