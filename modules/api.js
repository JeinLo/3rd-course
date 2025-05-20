const commentsHost = 'https://wedev-api.sky.pro/api/v2/baranova-evgeniya'
const authHost = 'https://wedev-api.sky.pro/api/user'

// Получение списка комментариев
export const fetchComments = () => {
    return fetch(`${commentsHost}/comments`, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache',
        },
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Не удалось загрузить комментарии')
            }
            return res.json()
        })
        .then((data) => {
            console.log('fetchComments response:', data.comments)
            return data.comments.map((comment) => ({
                id: comment.id,
                name: comment.author?.name || 'Anonymous',
                date: comment.date,
                text: comment.text,
                likes: comment.likes,
                isLiked: comment.isLiked || false,
            }))
        })
}

// Добавление нового комментария
export const postComment = (text) => {
    const token = localStorage.getItem('authToken')
    if (!token) {
        throw new Error('Требуется авторизация')
    }

    return fetch(`${commentsHost}/comments`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
    }).then((res) => {
        if (!res.ok) {
            if (res.status === 401) {
                localStorage.removeItem('authToken')
                localStorage.removeItem('userName')
                throw new Error('Требуется авторизация')
            }
            throw new Error('Не удалось отправить комментарий')
        }
        return res.json()
    })
}

// Авторизация пользователя
export const loginUser = (login, password) => {
    return fetch(`${authHost}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
    }).then((res) => {
        if (!res.ok) {
            return res.json().then((errorData) => {
                throw new Error(errorData.error || 'Неверный логин или пароль')
            })
        }
        return res.json()
    })
}

// Регистрация пользователя
export const registerUser = (login, name, password) => {
    return fetch(`${authHost}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, name, password }),
    }).then((res) => {
        if (!res.ok) {
            return res.json().then((errorData) => {
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
                    throw new Error(errorData.error || 'Ошибка регистрации')
                }
            })
        }
        return res.json()
    })
}

// Лайк комментария
export const likeComment = (commentId) => {
    const token = localStorage.getItem('authToken')
    if (!token) {
        throw new Error('Требуется авторизация')
    }

    return fetch(`${commentsHost}/comments/${commentId}/toggle-like`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache',
        },
    })
        .then((res) => {
            console.log(
                'Like response status:',
                res.status,
                'Comment ID:',
                commentId,
            )
            if (!res.ok) {
                return res.text().then((text) => {
                    try {
                        const errorData = JSON.parse(text)
                        if (res.status === 401) {
                            throw new Error('Требуется авторизация')
                        }
                        throw new Error(
                            errorData.error || 'Не удалось поставить лайк',
                        )
                    } catch (e) {
                        throw new Error(
                            'Сервер вернул некорректный ответ: ' +
                                text.slice(0, 100),
                        )
                    }
                })
            }
            return res.json()
        })
        .then((result) => {
            console.log('likeComment response:', result)
            return {
                result: {
                    likes: result.result?.likes || 0,
                    isLiked: result.result?.isLiked || false,
                },
            }
        })
}
