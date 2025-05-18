const commentsHost = 'https://wedev-api.sky.pro/api/v2/baranova-evgeniya'
const authHost = 'https://wedev-api.sky.pro/api/user'

export async function fetchComments() {
    try {
        const response = await fetch(`${commentsHost}/comments`, {
            method: 'GET',
        })

        if (!response.ok) {
            throw new Error('Ошибка загрузки комментариев')
        }

        const { comments } = await response.json()
        return comments.map((comment) => ({
            id: comment.id,
            name: comment.author.name,
            date: comment.date,
            text: comment.text,
            likes: comment.likes,
            isLiked: comment.isLiked,
        }))
    } catch (error) {
        throw new Error(error.message || 'Ошибка сети')
    }
}

export async function postComment(text) {
    const token = localStorage.getItem('authToken')
    if (!token) {
        throw new Error('Требуется авторизация')
    }

    try {
        const response = await fetch(`${commentsHost}/comments`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                text,
            }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Ошибка отправки комментария')
        }

        return response.json()
    } catch (error) {
        throw new Error(error.message || 'Ошибка сети')
    }
}

export async function loginUser(login, password) {
    try {
        const res = await fetch(`${authHost}/login`, {
            method: 'POST',
            body: JSON.stringify({
                login,
                password,
            }),
        })

        if (!res.ok) {
            const errorData = await res.json()
            if (res.status === 400) {
                throw new Error(errorData.error || 'Неверный логин или пароль')
            }
            throw new Error(errorData.error || 'Ошибка сервера')
        }

        return res.json()
    } catch (error) {
        throw new Error(error.message || 'Ошибка сети')
    }
}

export async function registerUser(login, name, password) {
    try {
        const res = await fetch(`${authHost}`, {
            method: 'POST',
            body: JSON.stringify({
                login,
                name,
                password,
            }),
        })

        if (!res.ok) {
            const errorData = await res.json()
            if (res.status === 400) {
                if (
                    errorData.error &&
                    errorData.error.includes('already exists')
                ) {
                    throw new Error(
                        'Пользователь с таким логином уже существует',
                    )
                } else if (
                    errorData.error &&
                    errorData.error.includes('password')
                ) {
                    throw new Error(
                        'Пароль слишком короткий или не соответствует требованиям',
                    )
                } else {
                    throw new Error(
                        errorData.error ||
                            'Ошибка регистрации: неверные данные',
                    )
                }
            }
            throw new Error(errorData.error || 'Ошибка сервера')
        }

        return res.json()
    } catch (error) {
        throw new Error(error.message || 'Ошибка сети')
    }
}

export async function likeComment(commentId) {
    const token = localStorage.getItem('authToken')
    if (!token) {
        throw new Error('Требуется авторизация')
    }

    try {
        const response = await fetch(
            `${commentsHost}/comments/${commentId}/toggle-like`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        )

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Ошибка обработки лайка')
        }

        return response.json()
    } catch (error) {
        throw new Error(error.message || 'Ошибка сети')
    }
}
