const commentsHost = 'https://wedev-api.sky.pro/api/v2/baranova-evgeniya '
const authHost = 'https://wedev-api.sky.pro/api/user '

export const fetchComments = () => {
    return fetch(`${commentsHost}/comments`)
        .then((res) => {
            if (!res.ok) throw new Error('Не удалось загрузить комментарии')
            return res.json()
        })
        .then((data) =>
            data.comments.map((comment) => ({
                id: comment.id,
                name: comment.author.name || 'Anonymous',
                date: comment.date,
                text: comment.text,
                likes: comment.likes,
                isLiked: comment.isLiked || false,
            })),
        )
}

export const postComment = (text) => {
    const token = localStorage.getItem('authToken')
    if (!token) throw new Error('Требуется авторизация')

    return fetch(`${commentsHost}/comments`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
    }).then((res) => {
        if (!res.ok) throw new Error('Не удалось отправить комментарий')
        return res.json()
    })
}

export const loginUser = (login, password) => {
    return fetch(`${authHost}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
    }).then(async (res) => {
        if (!res.ok) throw new Error('Неверный логин или пароль')
        return await res.json()
    })
}

export const registerUser = (login, name, password) => {
    return fetch(`${authHost}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, name, password }),
    }).then(async (res) => {
        if (!res.ok) throw new Error('Ошибка регистрации')
        return await res.json()
    })
}

export const likeComment = (id, token) => {
    return fetch(`${commentsHost}/comments/${id}/like`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => {
        if (!res.ok) throw new Error('Не удалось поставить лайк')
        return res.json()
    })
}
