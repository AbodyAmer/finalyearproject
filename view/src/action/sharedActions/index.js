export const login = 'LOGIN'
export const logout = 'LOGOUT'

export const signin = (user) => {

    const action = {
        type: login,
        user
    }
    return action
}

export const signout = () => {
    const action = {
        type: logout 
    }
    return action
}