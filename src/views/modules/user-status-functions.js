export const checkUserStatus = () => {
    return localStorage.getItem('token')? true : false
}
export const handleLogout = () =>{
    const token = localStorage.getItem('token')
    if(token){
        localStorage.removeItem('token')
        window.location.reload() 
    } else{
        alert('token이 없는 상태입니다.')
    }
}