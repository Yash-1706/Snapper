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

        // Add user message
        this.addMessage('user', prompt, 'You');

        // Show typing indicator
        this.showTypingIndicator();

        try {
            const response = await window.geminiAPI.generateResponse(prompt, window.sidebarApp.currentContent);
            
            // Hide typing indicator before adding response
            this.hideTypingIndicator();
            
            // Wait a moment for smooth transition
            setTimeout(() => {
                this.addMessage('ai', this.formatResponse(response), 'Snapper AI');
            }, 250);
            
        } catch (error) {
            console.error('Error generating response:', error);
            this.hideTypingIndicator();
            
            setTimeout(() => {
                this.addMessage('ai', `Sorry, I encountered an error: ${error.message}. Please try again.`, 'Snapper AI');
            }, 250);
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

        // Add user message
        this.addMessage('user', message, 'You');

        // Show typing indicator
        this.showTypingIndicator();

        try {
            const response = await window.geminiAPI.generateResponse(message, window.sidebarApp.currentContent);
            
            // Hide typing indicator before adding response
            this.hideTypingIndicator();
            
            // Wait a moment for smooth transition
            setTimeout(() => {
                this.addMessage('ai', this.formatResponse(response), 'Snapper AI');
            }, 250);
            
        } catch (error) {
            console.error('Error generating response:', error);
            this.hideTypingIndicator();
            
            setTimeout(() => {
                this.addMessage('ai', `Sorry, I encountered an error: ${error.message}. Please try again.`, 'Snapper AI');
            }, 250);
        } finally {
            this.isProcessing = false;
        }
    }

    addMessage(type, content, sender) {
        if (!this.chatMessages) return;

        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageElement.innerHTML = `
            <div class="message-content">${content}</div>
            <div class="message-time">${timestamp}</div>
        `;

        // Add with animation
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(10px)';
        
        this.chatMessages.appendChild(messageElement);
        
        // Trigger animation
        requestAnimationFrame(() => {
            messageElement.style.transition = 'all 0.3s ease-out';
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        });
        
        this.scrollToBottom();
    }

    formatResponse(response) {
    // Clean up the response and format it properly
    let cleanResponse = response;
    
    // Remove any HTML tags that might be in the response
    cleanResponse = cleanResponse.replace(/<[^>]*>/g, '');
    
    // Fix common formatting issues
    cleanResponse = cleanResponse
        .replace(/\n\n+/g, '\n\n') // Multiple newlines to double newlines
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
        .replace(/`(.*?)`/g, '<code>$1</code>') // Inline code
        .replace(/\n/g, '<br>') // Line breaks
        .trim();
    
    return cleanResponse;
}


    addMessage(type, content, sender) {
        if (!this.chatMessages) return;

        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Simplified message structure for WhatsApp-style layout
        messageElement.innerHTML = `
            <div class="message-content">${content}</div>
            <div class="message-time">${timestamp}</div>
        `;

        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    // ... rest of the existing methods remain the same ...
    
    showTypingIndicator() {
        if (!this.chatMessages) return;

        // Remove any existing typing indicator first
        this.hideTypingIndicator();

        const typingElement = document.createElement('div');
        typingElement.className = 'message ai typing-indicator';
        typingElement.id = 'typingIndicator';
        typingElement.innerHTML = `
            <div class="typing-animation">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;

        this.chatMessages.appendChild(typingElement);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            // Smooth fade out before removal
            typingIndicator.style.opacity = '0';
            typingIndicator.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                if (typingIndicator && typingIndicator.parentNode) {
                    typingIndicator.parentNode.removeChild(typingIndicator);
                }
            }, 200);
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
