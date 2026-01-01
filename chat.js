/* ═══════════════════════════════════════════════════════════
   CABIN TRIP 2026 — Chat (LocalStorage-based)
   ═══════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'cabinTrip2026_chat';
const MAX_MESSAGES = 100; // Keep last 100 messages

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

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Get messages from localStorage
function getMessages() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Error reading messages:', e);
        return [];
    }
}

// Save messages to localStorage
function saveMessages(messages) {
    try {
        // Keep only the last MAX_MESSAGES
        const toSave = messages.slice(-MAX_MESSAGES);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
        console.error('Error saving messages:', e);
        // If storage is full, try to clear old messages
        if (e.name === 'QuotaExceededError') {
            const recentMessages = messages.slice(-50);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(recentMessages));
        }
    }
}

// Add a new message
function addMessage(name, message) {
    const messages = getMessages();
    messages.push({
        name: name,
        message: message,
        timestamp: Date.now(),
        id: Date.now() + Math.random() // Simple unique ID
    });
    saveMessages(messages);
    return messages;
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

// Render all messages
function renderMessages() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messages = getMessages();
    
    chatMessages.innerHTML = '';
    
    if (messages.length === 0) {
        chatMessages.innerHTML = '<p class="chat-placeholder">No messages yet. Be the first!</p>';
        return;
    }
    
    messages.forEach((data) => {
        chatMessages.appendChild(renderMessage(data));
    });
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
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
    
    // Load and render existing messages
    renderMessages();
    
    // Auto-refresh messages every 2 seconds (in case multiple tabs/devices)
    // Note: This only works if users are on the same device/browser
    setInterval(renderMessages, 2000);
    
    // Listen for storage events (updates from other tabs)
    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
            renderMessages();
        }
    });
    
    // Send message
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = chatName.value.trim();
        const message = chatMessage.value.trim();
        
        if (!name || !message) return;
        
        // Save name for next time
        localStorage.setItem('cabinChatName', name);
        
        // Add message
        addMessage(name, message);
        
        // Re-render messages
        renderMessages();
        
        // Clear message input
        chatMessage.value = '';
        chatMessage.focus();
    });
});
