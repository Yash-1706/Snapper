// Chat Handler - Better response formatting
class ChatHandler {
    constructor() {
        this.chatMessages = null;
        this.isProcessing = false;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.chatMessages = document.getElementById('chatMessages');
        });
    }

    async handleQuickAction(actionType, prompt) {
        if (this.isProcessing) {
            return;
        }

        if (!window.sidebarApp.isContentExtracted) {
            await window.sidebarApp.extractContent();
            if (!window.sidebarApp.isContentExtracted) {
                return;
            }
        }

        this.isProcessing = true;
        this.setQuickActionProcessing(actionType, true);
        this.hideWelcomeMessage();

        this.addMessage('user', prompt, 'You');
        this.showTypingIndicator();

        try {
            const response = await window.geminiAPI.generateResponse(prompt, window.sidebarApp.currentContent);
            
            this.hideTypingIndicator();
            this.addMessage('ai', this.formatResponse(response), 'Snapper AI');
            
        } catch (error) {
            console.error('Error generating response:', error);
            this.hideTypingIndicator();
            this.addMessage('ai', `Sorry, I encountered an error: ${error.message}. Please try again.`, 'Snapper AI');
        } finally {
            this.isProcessing = false;
            this.setQuickActionProcessing(actionType, false);
        }
    }

    async handleUserMessage(message) {
        if (this.isProcessing) {
            return;
        }

        if (!window.sidebarApp.isContentExtracted) {
            await window.sidebarApp.extractContent();
            if (!window.sidebarApp.isContentExtracted) {
                return;
            }
        }

        this.isProcessing = true;
        this.hideWelcomeMessage();

        this.addMessage('user', message, 'You');
        this.showTypingIndicator();

        try {
            const response = await window.geminiAPI.generateResponse(message, window.sidebarApp.currentContent);
            
            this.hideTypingIndicator();
            this.addMessage('ai', this.formatResponse(response), 'Snapper AI');
            
        } catch (error) {
            console.error('Error generating response:', error);
            this.hideTypingIndicator();
            this.addMessage('ai', `Sorry, I encountered an error: ${error.message}. Please try again.`, 'Snapper AI');
        } finally {
            this.isProcessing = false;
        }
    }

    formatResponse(response) {
        // Format the response for better readability
        return response
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>');
    }

    addMessage(type, content, sender) {
        if (!this.chatMessages) return;

        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageElement.innerHTML = `
            <div class="message-header">
                <div class="message-avatar">${type === 'user' ? 'U' : 'AI'}</div>
                <span class="message-sender">${sender}</span>
            </div>
            <div class="message-content">${content}</div>
            <div class="message-time">${timestamp}</div>
        `;

        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    // ... rest of the existing methods remain the same ...
    
    showTypingIndicator() {
        if (!this.chatMessages) return;

        const typingElement = document.createElement('div');
        typingElement.className = 'message ai typing-indicator';
        typingElement.id = 'typingIndicator';
        typingElement.innerHTML = `
            <div class="message-header">
                <div class="message-avatar">AI</div>
                <span class="message-sender">Snapper AI</span>
            </div>
            <div class="typing-animation">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;

        this.chatMessages.appendChild(typingElement);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    setQuickActionProcessing(actionType, isProcessing) {
        const buttons = document.querySelectorAll('.quick-action-btn');
        buttons.forEach(btn => {
            if (isProcessing) {
                btn.disabled = true;
                if (btn.getAttribute('data-action') === actionType) {
                    btn.classList.add('processing');
                }
            } else {
                btn.disabled = false;
                btn.classList.remove('processing');
            }
        });
    }

    hideWelcomeMessage() {
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage) {
            welcomeMessage.style.display = 'none';
        }
    }

    scrollToBottom() {
        if (this.chatMessages) {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }

    clearChat() {
        if (this.chatMessages) {
            this.chatMessages.innerHTML = '';
        }
    }
}

window.chatHandler = new ChatHandler();
