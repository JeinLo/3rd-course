export const comments = []

export function updateComments(newComments) {
    comments.length = 0
    comments.push(...newComments)
}
