const closeSesion = () => {
    const btnLogout = document.getElementById('logout')
    const pUser = document.getElementById('user')
    btnLogout.addEventListener('click', () => {
        console.log("cerrar sesion")
        localStorage.removeItem("username")
        pUser.style.display = "none"
        btnLogout.style.display = "none"
    })
}
closeSesion()