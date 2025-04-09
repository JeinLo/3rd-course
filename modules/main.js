import { renderComments } from './render.js'
import { addComment } from './addComment.js'
import { addEventListeners } from './listeners.js'
import { comments } from './comments.js'

const nameInput = document.querySelector('.add-form-name')
const commentInput = document.querySelector('.add-form-text')
const addButton = document.querySelector('.add-form-button')
const commentList = document.querySelector('.comments')

console.log('addButton:', addButton)

addButton.addEventListener('click', () => {
    console.log('Button clicked!')
    addComment(nameInput, commentInput, commentList, comments)
})

addEventListeners(commentList, nameInput, commentInput, renderComments)

renderComments(commentList, commentInput, nameInput)
