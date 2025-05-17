const commentsHost = 'https://wedev-api.sky.pro/api/v2/baranova-evgeniya'
const authHost = 'https://wedev-api.sky.pro/api/user'

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

// Авторизация пользователя
export const loginUser = (login, password) => {
    console.log(
        'Sending login request to:',
        `${authHost}/login`,
        'with data:',
        { login, password },
    )
    return fetch(`${authHost}/login`, {
        method: 'POST',
        body: JSON.stringify({ login, password }),
    })
        .then((res) => {
            console.log('Login response:', res.status, res.statusText)
            return res.text().then((responseText) => {
                console.log('Login response body:', responseText)

                if (!res.ok) {
                    try {
                        const errorData = JSON.parse(responseText)
                        if (res.status === 400) {
                            throw new Error(
                                errorData.error || 'Неверный логин или пароль',
                            )
                        } else {
                            throw new Error(`Ошибка сервера: ${res.status}`)
                        }
                    } catch (e) {
                        console.error(
                            'Failed to parse login error response:',
                            e,
                        )
                        throw new Error(
                            'Ошибка сервера при авторизации: не удалось разобрать ответ',
                        )
                    }
                }

                return JSON.parse(responseText)
            })
        })
        .catch((error) => {
            console.error('Network or parsing error during login:', error)
            throw error
        })
}

export const registerUser = (login, name, password) => {
    console.log('Sending register request to:', `${authHost}`, 'with data:', {
        login,
        name,
        password,
    })
    return fetch(`${authHost}`, {
        method: 'POST',
        body: JSON.stringify({ login, name, password }),
    })
        .then((res) => {
            console.log('Register response:', res.status, res.statusText)
            return res.text().then((responseText) => {
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

                    try {
                        const errorData = JSON.parse(responseText)
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
                        } else if (res.status === 500) {
                            throw new Error(
                                'Сервер временно недоступен, попробуйте позже',
                            )
                        } else {
                            throw new Error(`Ошибка сервера: ${res.status}`)
                        }
                    } catch (e) {
                        console.error(
                            'Failed to parse register error response:',
                            e,
                        )
                        throw new Error(
                            'Ошибка сервера при регистрации: не удалось разобрать ответ',
                        )
                    }
                }

                return JSON.parse(responseText)
            })
        })
        .catch((error) => {
            console.error(
                'Network or parsing error during registration:',
                error,
            )
            throw error
        })
}
