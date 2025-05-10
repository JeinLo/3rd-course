const commentsHost = 'https://wedev-api.sky.pro/api/v2/baranova-evgeniya'
const authHost = 'https://wedev-api.sky.pro/api/v2/baranova-evgeniya'

export const fetchComments = () => {
    console.log('Fetching comments from:', `${commentsHost}/comments`)
    return fetch(`${commentsHost}/comments`, {
        method: 'GET',
    })
        .then((res) => {
            console.log('Fetch comments response:', res.status, res.statusText)
            if (!res.ok) {
                throw new Error('Не удалось загрузить комментарии')
            }
            return res.json()
        })
        .then((data) => {
            return data.comments.map((comment) => ({
                id: comment.id,
                name: comment.author?.name || 'Anonymous',
                date: comment.date || new Date().toISOString(),
                text: comment.text || '',
                likes: comment.likes || 0,
                isLiked: comment.isLiked || false,
            }))
        })
}

export const postComment = (text) => {
    console.log('Posting comment to:', `${commentsHost}/comments`)
    const token = localStorage.getItem('authToken')
    if (!token) {
        throw new Error('Требуется авторизация')
    }

    return fetch(`${commentsHost}/comments`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
    }).then((res) => {
        console.log('Post comment response:', res.status, res.statusText)
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

export const loginUser = (login, password) => {
    console.log(
        'Sending login request to:',
        `${authHost}/login`,
        'with data:',
        { login, password },
    )

    // Преобразуем данные в формат application/x-www-form-urlencoded
    const formData = new URLSearchParams()
    formData.append('login', login)
    formData.append('password', password)

    return fetch(`${authHost}/login`, {
        method: 'POST',
        body: formData, // Отправляем данные в формате application/x-www-form-urlencoded
    })
        .then(async (res) => {
            console.log('Login response:', res.status, res.statusText)
            const responseText = await res.text()
            console.log('Login response body:', responseText)
            if (!res.ok) {
                let errorData
                try {
                    errorData = JSON.parse(responseText)
                } catch (e) {
                    console.error('Failed to parse login error response:', e)
                    throw new Error(
                        'Ошибка сервера при авторизации: не удалось разобрать ответ',
                    )
                }
                if (res.status === 400) {
                    throw new Error(
                        errorData.error || 'Неверный логин или пароль',
                    )
                }
                throw new Error(`Ошибка сервера: ${res.status}`)
            }
            return JSON.parse(responseText)
        })
        .catch((error) => {
            console.error('Network or parsing error during login:', error)
            throw error
        })
}

export const registerUser = (login, name, password) => {
    console.log(
        'Sending register request to:',
        `${authHost}/register-user`,
        'with data:',
        { login, name, password },
    )

    // Преобразуем данные в формат application/x-www-form-urlencoded
    const formData = new URLSearchParams()
    formData.append('login', login)
    formData.append('name', name)
    formData.append('password', password)

    return fetch(`${authHost}/register-user`, {
        method: 'POST',
        body: formData, // Отправляем данные в формате application/x-www-form-urlencoded
    })
        .then(async (res) => {
            console.log('Register response:', res.status, res.statusText)
            const responseText = await res.text()
            console.log('Register response body:', responseText)
            if (!res.ok) {
                if (
                    responseText.startsWith('<!DOCTYPE') ||
                    responseText.includes('<html')
                ) {
                    throw new Error(
                        'Эндпоинт для регистрации не найден (404). Проверьте правильность URL.',
                    )
                }

                let errorData
                try {
                    errorData = JSON.parse(responseText)
                } catch (e) {
                    console.error('Failed to parse register error response:', e)
                    throw new Error(
                        'Ошибка сервера при регистрации: не удалось разобрать ответ',
                    )
                }
                if (res.status === 400) {
                    if (errorData.error.includes('already exists')) {
                        throw new Error(
                            'Пользователь с таким логином уже существует',
                        )
                    } else if (errorData.error.includes('password')) {
                        throw new Error(
                            'Пароль слишком короткий или не соответствует требованиям',
                        )
                    } else {
                        throw new Error(
                            errorData.error ||
                                'Ошибка регистрации: неверные данные',
                        )
                    }
                } else if (res.status === 500) {
                    throw new Error(
                        'Сервер временно недоступен, попробуйте позже',
                    )
                }
                throw new Error(`Ошибка сервера: ${res.status}`)
            }
            return JSON.parse(responseText)
        })
        .catch((error) => {
            console.error(
                'Network or parsing error during registration:',
                error,
            )
            throw error
        })
}
