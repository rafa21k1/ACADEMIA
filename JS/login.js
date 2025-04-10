const formLogin = document.getElementById("form-login");
const messageError = document.getElementById("message-error-login");
const btnLogin = document.getElementById('submit-login');
const btnSesion = document.getElementById('btn-sesion')
const btnRegister = document.getElementById('btn-register')

const API_KEY = 'AIzaSyCtIekGqf_dnxqrpBuNu1aBW5oRqGQMSG8'; // Reemplaza con tu clave API
const SPREADSHEET_ID = '1etvlT5KE4mg8KLSiaiT_GNQNMSXeJbGdyJQTLyi-3ms'; // Reemplaza con tu ID de hoja de cálculo
const RANGE = 'users!A2:K1000';

export const GET_DATA_LOGIN = () => { 
    
        btnLogin.addEventListener('click', async () => {        
        const formData = new FormData(formLogin);
        const datosInputs = Object.fromEntries(formData);
        const inputEmail = datosInputs.email
        const inputPassword = datosInputs.password
        
        try {
            const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`)
            const data = await response.json()
            const dataSheets = data.values.map((fila) => { // formateamos un objeto con los datos de la hoja de calculo
                return {
                    username: fila[0],
                    email: fila[1], 
                    password: fila[2]
                };
                })
            // console.log(dataSheets)
            
            const emailFiltrado = dataSheets.find(e => e.email == inputEmail) // filtramos el email
            const passFiltrada = dataSheets.find(e => e.password == inputPassword) // filtrmos la contraseña
                        
            if (emailFiltrado === undefined) {
                messageError.style.color = "red";
                messageError.textContent = `El usuario ${inputEmail} no está registrado`;
                
            }
            else if (passFiltrada === undefined) {
                messageError.style.color = "red";
                messageError.textContent = `La contraseña no es correcta`;
            } else {
                const pUser = document.getElementById('user')
                const btnLogout = document.getElementById('logout')

                pUser.textContent = `Bienvenido ${emailFiltrado.username}`
                pUser.style.display = "block"
                btnLogout.style.display = "block"
                document.getElementById('closed').click()
                localStorage.setItem("username", emailFiltrado.username)
                btnSesion.style.display = "none"
                btnRegister.style.display = "none"
            }            
        } catch (error) {
            console.log(error)
        }
    })
}

export const LOGOUT = () => {
    const btnLogout = document.getElementById('logout')
    const pUser = document.getElementById('user')
    btnLogout.addEventListener('click', () => {
        
        localStorage.removeItem("username")
        pUser.style.display = "none"
        btnLogout.style.display = "none"
        btnSesion.style.display = "block"
        btnRegister.style.display = "block"
    })
}
