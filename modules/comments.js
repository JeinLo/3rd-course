export let comments = [
    {
        name: 'Глеб Фокин',
        date: '2022-02-12T12:18:00.000Z',
        text: 'Это будет первый комментарий на этой странице',
        likes: 3,
        isLiked: false,
    },
    {
        name: 'Варвара Н.',
        date: '2022-02-13T19:22:00.000Z',
        text: 'Мне нравится как оформлена эта страница! ❤',
        likes: 75,
        isLiked: true,
    },
]

export const updateComments = (newComments) => {
    comments = [...comments, ...newComments]
}
