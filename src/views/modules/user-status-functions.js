export const checkUserStatus = () => {
    return localStorage.getItem('token')? true : false
}