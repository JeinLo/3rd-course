const host = 'https://wedev-api.sky.pro/api/v2/baranova-evgeniya'

export const fetchComments = () => {
    return fetch(`${host}/comments`, {
        method: 'GET',
    })
        .then((res) => {
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
    const token = localStorage.getItem('authToken')
    if (!token) {
        throw new Error('Требуется авторизация')
    }

    return fetch(`${host}/comments`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
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

export const loginUser = (login, password) => {
    return fetch(`${host}/user/login`, {
        method: 'POST',
        body: JSON.stringify({ login, password }),
    }).then((res) => {
        if (!res.ok) {
            throw new Error('Неверный логин или пароль')
        }
        return res.json()
    })
}

export const registerUser = (login, name, password) => {
    return fetch(`${host}/user`, {
        method: 'POST',
        body: JSON.stringify({ login, name, password }),
    }).then((res) => {
        if (!res.ok) {
            throw new Error('Ошибка регистрации')
        }
        return res.json()
    })
}
