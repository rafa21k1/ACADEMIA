//Funcion de Google API para acceder a la autenticacion de Google y a la API de Google Sheets

const CLIENT_ID = '579899173082-010suqonjvrore9vh0m16gkbv9co4r41.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let tokenClient;
let gapiInited = false;
let gisInited = false;

export function gapiLoaded() {
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
