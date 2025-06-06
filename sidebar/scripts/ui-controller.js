// UI Controller - Handle all UI interactions
class UIController {
    constructor() {
        this.userInput = null;
        this.sendBtn = null;
        this.quickActionsToggle = null;
        this.quickActionsContent = null;
        this.contextMode = null;
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
        this.quickActionsToggle = document.getElementById('quickActionsToggle');
        this.quickActionsContent = document.getElementById('quickActionsContent');
        this.contextMode = document.getElementById('contextMode');
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

        // Quick actions toggle
        if (this.quickActionsToggle) {
            this.quickActionsToggle.addEventListener('click', () => this.toggleQuickActions());
        }

        // Quick action buttons
        this.setupQuickActionButtons();

        // Context mode change
        if (this.contextMode) {
            this.contextMode.addEventListener('change', () => this.handleContextChange());
        }
    }

    handleInputChange() {
        // Auto-resize textarea
        this.userInput.style.height = 'auto';
        this.userInput.style.height = Math.min(this.userInput.scrollHeight, 120) + 'px';
        
        // Enable send button only if input has content AND content is extracted
        const hasContent = this.userInput.value.trim().length > 0;
        const contentReady = window.sidebarApp && window.sidebarApp.isContentExtracted;
        
        this.sendBtn.disabled = !(hasContent && contentReady);
    }

    handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (this.userInput.value.trim() && !this.sendBtn.disabled) {
                this.handleSendMessage();
            }
        }
    }

    handleSendMessage() {
        const message = this.userInput.value.trim();
        if (message && !this.sendBtn.disabled) {
            // Check if content is extracted before sending
            if (window.sidebarApp && !window.sidebarApp.canSendMessage()) {
                return;
            }

            console.log('Sending message:', message);
            // TODO: Add actual message sending logic
            this.clearInput();
        }
    }

    clearInput() {
        this.userInput.value = '';
        this.userInput.style.height = 'auto';
        this.sendBtn.disabled = true;
    }

    toggleQuickActions() {
        const isExpanded = this.quickActionsContent.style.display !== 'none';
        this.quickActionsContent.style.display = isExpanded ? 'none' : 'grid';

        const arrow = this.quickActionsToggle.querySelector('.toggle-arrow');
        if (arrow) {
            arrow.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    }

    setupQuickActionButtons() {
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const prompt = btn.getAttribute('data-prompt');
                this.userInput.value = prompt;
                this.handleInputChange();
                this.userInput.focus();
            });
        });
    }

    handleContextChange() {
        const selectedMode = this.contextMode.value;
        console.log('Context mode changed to:', selectedMode);
        // TODO: Handle context mode change logic
    }

    showLoading() {
        const loadingContainer = document.getElementById('loadingContainer');
        if (loadingContainer) {
            loadingContainer.style.display = 'flex';
        }
    }

    hideLoading() {
        const loadingContainer = document.getElementById('loadingContainer');
        if (loadingContainer) {
            loadingContainer.style.display = 'none';
        }
    }
}

// Initialize UI controller
new UIController();
