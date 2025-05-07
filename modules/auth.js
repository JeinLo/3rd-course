export const getUserFromStorage = () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
}

export const saveUserToStorage = (user) => {
    localStorage.setItem('user', JSON.stringify(user))
}

export const removeUserFromStorage = () => {
    localStorage.removeItem('user')
}
