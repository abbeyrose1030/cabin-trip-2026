/* ═══════════════════════════════════════════════════════════
   CABIN TRIP 2026 — Chat
   ═══════════════════════════════════════════════════════════ */

const firebaseConfig = {
    apiKey: "AIzaSyD4npNgTmVh8TA6TdEbBQI8N6DC9EW4L9k",
    authDomain: "cabintrip2026.firebaseapp.com",
    databaseURL: "https://cabintrip2026-default-rtdb.firebaseio.com",
    projectId: "cabintrip2026",
    storageBucket: "cabintrip2026.firebasestorage.app",
    messagingSenderId: "867346528708",
    appId: "1:867346528708:web:f143bf898670bd0190cc91",
    measurementId: "G-VY5R64JWLH"
};

// Initialize Firebase
let db;
if (typeof firebase !== 'undefined') {
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.database();
    } catch (e) {
        // Firebase might already be initialized by another script, try to get database instance
        try {
            db = firebase.database();
        } catch (err) {
            console.log('Firebase initialization error:', err.message);
        }
    }
} else {
    console.log('Firebase library not loaded');
}

// Format timestamp
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
               date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
}

// Render a message
function renderMessage(data) {
    const msg = document.createElement('div');
    msg.className = 'chat-message';
    msg.innerHTML = `
        <div class="chat-message-header">
            <span class="chat-message-name">${escapeHtml(data.name)}</span>
            <span class="chat-message-time">${formatTime(data.timestamp)}</span>
        </div>
        <p class="chat-message-text">${escapeHtml(data.message)}</p>
    `;
    return msg;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize chat when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const chatForm = document.getElementById('chatForm');
    const chatName = document.getElementById('chatName');
    const chatMessage = document.getElementById('chatMessage');
    
    // Safety check - elements must exist
    if (!chatMessages || !chatForm || !chatName || !chatMessage) {
        console.error('Chat elements not found');
        return;
    }
    
    // Load saved name from localStorage
    if (localStorage.getItem('cabinChatName')) {
        chatName.value = localStorage.getItem('cabinChatName');
    }
    
    // Listen for messages
    if (db) {
        const messagesRef = db.ref('messages');
        
        messagesRef.orderByChild('timestamp').limitToLast(50).on('value', (snapshot) => {
            chatMessages.innerHTML = '';
            
            if (!snapshot.exists()) {
                chatMessages.innerHTML = '<p class="chat-placeholder">No messages yet. Be the first!</p>';
                return;
            }
            
            const messages = [];
            snapshot.forEach((child) => {
                messages.push(child.val());
            });
            
            messages.forEach((data) => {
                chatMessages.appendChild(renderMessage(data));
            });
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    } else {
        chatMessages.innerHTML = '<p class="chat-placeholder">Chat not configured yet.<br>Add Firebase config to chat.js</p>';
    }
    
    // Send message
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!db) {
            alert('Chat not configured yet. Add Firebase config to chat.js');
            return;
        }
        
        const name = chatName.value.trim();
        const message = chatMessage.value.trim();
        
        if (!name || !message) return;
        
        // Save name for next time
        localStorage.setItem('cabinChatName', name);
        
        // Push message to Firebase
        db.ref('messages').push({
            name: name,
            message: message,
            timestamp: Date.now()
        });
        
        // Clear message input
        chatMessage.value = '';
        chatMessage.focus();
    });
});

