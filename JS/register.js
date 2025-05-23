const formRegister = document.getElementById("form-register");
const messageError = document.getElementById("message-error-register");

const API_KEY = 'AIzaSyCtIekGqf_dnxqrpBuNu1aBW5oRqGQMSG8'; // Reemplaza con tu clave API
const SPREADSHEET_ID = '1etvlT5KE4mg8KLSiaiT_GNQNMSXeJbGdyJQTLyi-3ms'; // Reemplaza con tu ID de hoja de cálculo
const RANGE = 'users!A2:K1000';


export const GET_DATA = () => {
    formRegister.addEventListener('input', async () => {
        //Añadimos evento input, lanzamos fecht GET para recorrer el mismo y filtrar elusuario y el email
        const btnSubmit = document.getElementById('submit-register')
        const formData = new FormData(formRegister);
        const datosInputs = Object.fromEntries(formData);
        const inputUser = datosInputs.username
        const inputEmail = datosInputs.email
        const inputPassword = datosInputs.password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/; // Al menos 8 caracteres, 1 mayúscula, 1 minúscula y 1 número
        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;// @ obligatorio, al menos 2 letras después del punto
        const usernameRegex = /^.{3,}$/; // Al menos 3 caracteres

        try {
            const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`)
            const data = await response.json()
            const dataSheets = data.values.map((fila) => {
                return {
                    username: fila[0], 
                    email: fila[1], 
                    password: fila[2]
                };
            }) // Aquí obtienes las filas de la hoja de cálculo
            //console.log(dataSheets);

            const userFiltrado = dataSheets.find(e => e.username == inputUser) // filtramos el nombre de usuario
            const emailFiltrado = dataSheets.find(e => e.email == inputEmail) // filtramos el email
            
            // Si el dato recogido es undefined es porque no está en el Json, caso contrario ya existe y no permitirá registrare
            console.log(inputUser.length)
            console.log(emailFiltrado)
            //filtramos el input ingresado por el usuario y lo comparamos con el regex
            if (!usernameRegex.test(inputUser.trim()) && inputUser.trim().length > 0) {
                messageError.style.color = "red";
                messageError.textContent = "El nombre de usuario debe tener al menos 3 caracteres";
                btnSubmit.disabled = true;
            } else if (!emailRegex.test(inputEmail.trim()) && inputEmail.trim().length > 0) {
                messageError.style.color = "red";
                messageError.textContent = "El email debe tener un formato válido";
                btnSubmit.disabled = true;
            }
            else if (!passwordRegex.test(inputPassword.trim()) && inputPassword.trim().length > 0) {
                messageError.style.color = "red";
                messageError.textContent = "La contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 minúscula y 1 número";
                btnSubmit.disabled = true;
            } else if (userFiltrado === '') {
                messageError.textContent = '';
                btnSubmit.disabled = false;
            } else if (userFiltrado !== undefined) {
                messageError.style.color = "red";
                messageError.textContent = `El usuario ${inputUser} ya está registrado`;
                btnSubmit.disabled = true;
            } else if (userFiltrado === undefined || inputUser.trim().length === 0) {
                messageError.textContent = '';
                btnSubmit.disabled = false
            } else if (emailFiltrado === '') {
                messageError.textContent = '';
                btnSubmit.disabled = false;
            } else if (emailFiltrado !== undefined || inputEmail.trim().length === 0) {
                messageError.style.color = "red";
                messageError.textContent = `El email ${inputEmail} ya está registrado`;
                btnSubmit.disabled = true;
            } 
            
        } catch (error) {
            console.log(error)
        }
    })
}

// autenticamos con ID de clientes OAuth 2.0
// autenticamos con ID de clientes OAuth 2.0
let accessToken = "";

function initOAuth() {
    google.accounts.oauth2.initTokenClient({
        client_id: '579899173082-010suqonjvrore9vh0m16gkbv9co4r41.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/spreadsheets',
        callback: (tokenResponse) => {
            accessToken = tokenResponse.access_token;
        },
    }).requestAccessToken();
}

const CLIENT_ID = '579899173082-010suqonjvrore9vh0m16gkbv9co4r41.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let tokenClient;
let gapiInited = false;
let gisInited = false;

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    });
    gapiInited = true;
    maybeEnableFeatures();
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // Se configurará más adelante
    });
    gisInited = true;
    maybeEnableFeatures();
}

function maybeEnableFeatures() {
    if (gapiInited && gisInited) {
        // Aquí se lanza automáticamente la autorización al iniciar
        tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                throw resp;
            }
            console.log("Autenticado correctamente con Google");
        };
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

// Carga los scripts al iniciar
window.onload = () => {
    gapiLoaded();
    gisLoaded();
};


export const POST_DATA = () => {
    formRegister.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(formRegister);
        const datosInputs = Object.fromEntries(formData);

        if (!datosInputs.username || !datosInputs.email || !datosInputs.password) {
            messageError.style.color = "red";
            messageError.textContent = "Campos incompletos, revisar";
            return;
        }

        try {
            // Asegura que tengamos el token de acceso
            if (!accessToken) {
                initOAuth();
                return;
            }

            const spreadsheetId = '1etvlT5KE4mg8KLSiaiT_GNQNMSXeJbGdyJQTLyi-3ms';
            const range = 'users!A2:C';
            const postUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;

            const body = {
                range,
                majorDimension: "ROWS",
                values: [
                    [datosInputs.username, datosInputs.email, datosInputs.password]
                ]
            };

            const postResponse = await fetch(postUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (postResponse.ok) {
                const dataResponse = await postResponse.json();
                //console.log("Datos enviados a Google Sheets:", dataResponse);
                messageError.style.color = "green";
                messageError.textContent = "Registro exitoso";
            } else {
                //console.error("Error al enviar datos:", await postResponse.text());
                messageError.style.color = "red";
                messageError.textContent = "Error al registrar los datos";
            }
        } catch (error) {
            console.error(error);
            messageError.style.color = "red";
            messageError.textContent = "Error al conectar con Google Sheets";
        }
    });
};
