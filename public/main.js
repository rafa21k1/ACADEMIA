// Archivo: public/main.js
document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const chatForm = document.getElementById('chat-form');
    const chatMessages = document.getElementById('chat-messages');
    const msgInput = document.getElementById('msg');
    const useAgentCheckbox = document.getElementById('use-agent');
    const usersList = document.getElementById('users-list');
    const typingIndicator = document.getElementById('typing-indicator');
    const connectionStatus = document.getElementById('connection-status');
    
    // Colores para usuarios
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B', 
        '#FB5607', '#8338EC', '#3A86FF', '#0ACF83'
    ];
    const userColors = {};
    
    // Conectar al servidor Socket.io
    const socket = io();
    
    // Manejar conexión
    socket.on('connect', () => {
        console.log('Conectado al servidor');
        connectionStatus.textContent = 'Conectado';
        document.querySelector('.status-dot').classList.add('connected');
        
        // Asignar un color a nuestro usuario
        userColors[socket.id] = getRandomColor();
    });
    
    // Manejar desconexión
    socket.on('disconnect', () => {
        console.log('Desconectado del servidor');
        connectionStatus.textContent = 'Desconectado';
        document.querySelector('.status-dot').classList.remove('connected');
    });
    
    // Manejar errores
    socket.on('error', (error) => {
        displayMessage({
            userId: 'system',
            text: `Error: ${error.message}`,
            timestamp: new Date().toISOString()
        });
    });
    
    // Recibir historial de chat
    socket.on('chat history', (history) => {
        chatMessages.innerHTML = '';
        history.forEach(msg => displayMessage(msg));
    });
    
    // Recibir mensajes nuevos
    socket.on('chat message', (msg) => {
        displayMessage(msg);
        
        // Auto-scroll al fondo
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
    
    // Estado de usuarios
    socket.on('user status', (data) => {
        // Si es un nuevo usuario, asignarle un color
        if (data.status === 'conectado' && !userColors[data.user]) {
            userColors[data.user] = getRandomColor();
        }
        
        updateUsersList();
        
        // Mostrar mensaje de sistema
        const statusMsg = {
            userId: 'system',
            text: `Usuario ${formatUserId(data.user)} ${data.status}`,
            timestamp: new Date().toISOString()
        };
        displayMessage(statusMsg);
    });
    
    // Mostrar indicador de "escribiendo..."
    socket.on('user typing', (data) => {
        if (data.isTyping) {
            typingIndicator.textContent = `${formatUserId(data.userId)} está escribiendo...`;
        } else {
            typingIndicator.textContent = '';
        }
    });
    
    // Enviar mensaje al presionar enviar
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const message = msgInput.value.trim();
        if (!message) return;
        
        socket.emit('chat message', {
            text: message,
            requiresAgentResponse: useAgentCheckbox.checked
        });
        
        // Limpiar el input
        msgInput.value = '';
        msgInput.focus();
        
        // Notificar que ya no estamos escribiendo
        socket.emit('typing', false);
    });
    
    // Detectar cuando el usuario está escribiendo
    let typingTimeout;
    msgInput.addEventListener('input', () => {
        socket.emit('typing', true);
        
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            socket.emit('typing', false);
        }, 1000);
    });
    
    // Función para mostrar mensajes en el chat
    function displayMessage(msg) {
        const div = document.createElement('div');
        div.classList.add('message');
        
        // Determinar si el mensaje es propio
        if (msg.userId === socket.id) {
            div.classList.add('my-message');
        } else if (msg.userId === 'system') {
            div.classList.add('system-message');
        } else if (msg.userId === 'agent') {
            div.classList.add('agent-message');
        }
        
        // Formatear hora
        const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Agregar avatar y contenido
        const userColor = msg.userId === 'system' ? '#888' : 
                        msg.userId === 'agent' ? '#4CAF50' : 
                        userColors[msg.userId] || getRandomColor();
        
        div.innerHTML = `
            <div class="message-avatar" style="background-color: ${userColor}">
                ${getInitials(msg.userId)}
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-user">${formatUserId(msg.userId)}</span>
                    <span class="message-time">${time}</span>
                </div>
                <p class="message-text">${msg.text}</p>
            </div>
        `;
        
        chatMessages.appendChild(div);
    }
    
    // Actualizar lista de usuarios
    function updateUsersList() {
        // Esta función podría mejorarse si el servidor enviara una lista completa de usuarios
        // Por ahora, es un marcador de posición
        usersList.innerHTML = `
            <li class="user">
                <div class="user-avatar" style="background-color: ${userColors[socket.id]}">
                    ${getInitials(socket.id)}
                </div>
                <span>Tú</span>
            </li>
            <li class="user">
                <div class="user-avatar" style="background-color: #4CAF50">AG</div>
                <span>Agente</span>
            </li>
        `;
    }
    
    // Utilidades
    function formatUserId(userId) {
        if (userId === socket.id) return 'Tú';
        if (userId === 'system') return 'Sistema';
        if (userId === 'agent') return 'Agente';
        return userId.substring(0, 4);
    }
    
    function getInitials(userId) {
        if (userId === socket.id) return 'TÚ';
        if (userId === 'system') return 'SYS';
        if (userId === 'agent') return 'AG';
        return userId.substring(0, 2).toUpperCase();
    }
    
    function getRandomColor() {
        return colors[Math.floor(Math.random() * colors.length)];
    }
});