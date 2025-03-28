// eslint-disable-next-line prettier/prettier
import { comments } from './comments.js'

export function setReplyToComment(index, nameInput, commentInput) {
    const comment = comments[index]
    nameInput.value = comment.name + ': '
    commentInput.value = comment.text + ' '
    commentInput.focus()
}
