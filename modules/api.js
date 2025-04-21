const host = 'https://wedev-api.sky.pro/api/v1/baranova-evgeniya'

export const fetchComments = () => {
    return fetch(`${host}/comments`, { method: 'GET' })
        .then((res) => {
            if (!res.ok) throw new Error('Ошибка загрузки комментариев')
            return res.json()
        })
        .then((data) =>
            data.comments.map((comment) => ({
                id: comment.id,
                name: comment.author.name,
                date: comment.date,
                text: comment.text,
                likes: comment.likes || 0,
                isLiked: comment.isLiked || false,
            })),
        )
}

export const postComment = (text, name) => {
    return fetch(`${host}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text, name }),
    }).then((res) => {
        if (!res.ok) {
            if (res.status === 400) {
                return res.json().then((errorData) => {
                    throw new Error(errorData.error || 'Некорректные данные')
                })
            }
            throw new Error('Ошибка сервера')
        }
        return res.json()
    })
}
