const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const socket = io('https://academia-wbiu.onrender.com/');
// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(__dirname + '/'));

// Manejar conexiones de Socket.IO
io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');

    socket.on('chat message', (msg) => {
        console.log('Mensaje recibido:', msg);
        io.emit('chat message', msg); // Enviar el mensaje a todos los clientes
    });

    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado');
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});