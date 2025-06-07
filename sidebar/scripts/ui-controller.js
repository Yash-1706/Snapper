// UI Controller - Updated for direct quick actions
class UIController {
    constructor() {
        this.userInput = null;
        this.sendBtn = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeElements();
            this.setupEventListeners();
        });
    }

    initializeElements() {
        this.userInput = document.getElementById('userInput');
        this.sendBtn = document.getElementById('sendBtn');
    }

    setupEventListeners() {
        // Input field auto-resize and send button state
        if (this.userInput) {
            this.userInput.addEventListener('input', () => this.handleInputChange());
            this.userInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        }

        // Send button click
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => this.handleSendMessage());
        }

        // Quick action buttons - Direct execution
        this.setupQuickActionButtons();
    }

    handleInputChange() {
        // Auto-resize textarea
        this.userInput.style.height = 'auto';
        this.userInput.style.height = Math.min(this.userInput.scrollHeight, 120) + 'px';
        
        // Enable/disable send button
        const hasContent = this.userInput.value.trim().length > 0;
        this.sendBtn.disabled = !hasContent;
    }

    handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (this.userInput.value.trim() && !this.sendBtn.disabled) {
                this.handleSendMessage();
            }
        }
    }

    async handleSendMessage() {
        const message = this.userInput.value.trim();
        if (message && !this.sendBtn.disabled && window.chatHandler) {
            this.clearInput();
            await window.chatHandler.handleUserMessage(message);
        }
    }

    clearInput() {
        this.userInput.value = '';
        this.userInput.style.height = 'auto';
        this.sendBtn.disabled = true;
    }

    setupQuickActionButtons() {
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const prompt = btn.getAttribute('data-prompt');
                const actionType = btn.getAttribute('data-action');
                
                if (window.chatHandler) {
                    await window.chatHandler.handleQuickAction(actionType, prompt);
                }
            });
        });
    }

    disableInterface() {
        if (this.userInput) this.userInput.disabled = true;
        if (this.sendBtn) this.sendBtn.disabled = true;
        
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.disabled = true;
        });
    }

    enableInterface() {
        if (this.userInput) this.userInput.disabled = false;
        
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.disabled = false;
        });
        
        this.handleInputChange(); // Update send button state
    }
}

// Initialize UI controller
new UIController();
