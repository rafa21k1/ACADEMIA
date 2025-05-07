export const cookies = () => {
    document.addEventListener("DOMContentLoaded", () => {
        const modalCookies = new bootstrap.Modal(document.getElementById("modal-cookies"));
        const aceptarBtn = document.getElementById("aceptar");
        const rechazarBtn = document.getElementById("rechazar");
            
        // Verificar si el usuario ya aceptó o rechazó las cookies
        if (!localStorage.getItem("cookieValue")) {
            modalCookies.show(); // Mostrar el modal si no hay registro previo
        }
    
        // Manejar el botón "Aceptar"
        aceptarBtn.addEventListener("click", () => {
            localStorage.setItem("cookieValue", "true");
            modalCookies.hide();
        });
    
        // Manejar el botón "Rechazar"
        rechazarBtn.addEventListener("click", () => {
            localStorage.setItem("cookieValue", "false");
            modalCookies.hide();
        });
    });
}

export const LOAD = () => {  
    const pUser = document.getElementById('user');
        const btnLogout = document.getElementById('logout');

        

        if (localStorage.getItem("username") !== null) {
            pUser.style.display = "block"
            btnLogout.style.display = "block"
            pUser.textContent = `Bienvenido ${localStorage.getItem("username")}`
        } else {
            pUser.style.display = "none"
            btnLogout.style.display = "none"
        }
}