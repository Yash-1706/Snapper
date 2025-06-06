class SidebarApp {
    constructor() {
        this.currentContent = null;
        this.isContentExtracted = false;
        this.currentTab = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupInitialState();
            this.bindEvents();
            this.getCurrentTab();
        });
    }

    async getCurrentTab() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            this.currentTab = tab;
            console.log('Current tab:', tab.url);
            this.checkIfValidTab();
        } catch (error) {
            console.error('Failed to get current tab:', error);
            this.showStatus('❌ Failed to get current tab', 'error');
        }
    }

    checkIfValidTab() {
        if (!this.currentTab) return;

        const url = this.currentTab.url;
        const isValidUrl = !url.startsWith('chrome://') && 
                            !url.startsWith('chrome-extension://') && 
                            !url.startsWith('edge://') && 
                            !url.startsWith('about:') &&
                            !url.startsWith('moz-extension://');

        if (!isValidUrl) {
            this.showStatus('❌ Cannot analyze browser internal pages', 'error');
            this.disableChatInterface();
        } else {
            this.showStatus('✅ Ready to analyze this page', 'success');
            this.testContentScript(); // Test if content script is working
        }
    }

    async testContentScript() {
        try {
            const response = await chrome.tabs.sendMessage(this.currentTab.id, {
                action: 'ping'
            });
            
            if (response && response.success) {
                console.log('✅ Content script is responding');
            }
        } catch (error) {
            console.log('⚠️ Content script needs injection');
            await this.ensureContentScriptInjected(this.currentTab.id);
        }
    }

    setupInitialState() {
        const loadingContainer = document.getElementById('loadingContainer');
        if (loadingContainer) {
            loadingContainer.style.display = 'none';
        }
        this.showWelcomeMessage();
    }

    bindEvents() {
        const sendBtn = document.getElementById('sendBtn');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                this.handleSendMessage();
            });
        }

        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleSendMessage();
            });
        });
    }

    async handleSendMessage() {
        if (!this.isContentExtracted) {
            await this.extractContent();
        }
        
        if (this.isContentExtracted) {
            console.log('✅ Ready to send message with content');
            console.log('Content preview:', this.currentContent.content.substring(0, 200) + '...');
        }
    }

    async extractContent() {
        if (!this.currentTab) {
            this.showStatus('❌ No active tab found', 'error');
            return;
        }

        const url = this.currentTab.url;
        if (url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
            this.showStatus('❌ Cannot analyze browser internal pages', 'error');
            return;
        }

        this.showLoading();
        this.showStatus('🔄 Extracting page content...', 'extracting');

        try {
            // Ensure content script is injected
            await this.ensureContentScriptInjected(this.currentTab.id);

            // Extract content
            const response = await chrome.tabs.sendMessage(this.currentTab.id, {
                action: 'extractContent',
                mode: 'fullPage'
            });

            if (response && response.success) {
                this.currentContent = response.content;
                this.isContentExtracted = true;
                this.hideLoading();
                this.hideWelcomeMessage();
                this.enableChatInterface();
                this.showStatus(`✅ Extracted ${response.content.wordCount} words`, 'success');
                console.log('✅ Content extracted successfully');
            } else {
                throw new Error(response ? response.error : 'No response from content script');
            }
        } catch (error) {
            console.error('❌ Content extraction failed:', error);
            this.hideLoading();
            this.showStatus('❌ Failed to extract content - Try refreshing the page', 'error');
        }
    }

    async ensureContentScriptInjected(tabId) {
        try {
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content/content-script.js']
            });
            console.log('📥 Content script injected');
            await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
            console.log('Content script injection info:', error.message);
        }
    }

    // ... rest of the existing methods (showStatus, showLoading, etc.)
    
    showStatus(message, type) {
        const statusIndicator = document.getElementById('statusIndicator');
        if (statusIndicator) {
            statusIndicator.textContent = message;
            statusIndicator.className = `status-indicator ${type}`;
            statusIndicator.style.display = 'block';

            if (type === 'success') {
                setTimeout(() => {
                    statusIndicator.style.display = 'none';
                }, 3000);
            }
        }
    }

    showWelcomeMessage() {
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage) {
            welcomeMessage.style.display = 'block';
        }
    }

    hideWelcomeMessage() {
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage) {
            welcomeMessage.style.display = 'none';
        }
    }

    enableChatInterface() {
        const sendBtn = document.getElementById('sendBtn');
        const userInput = document.getElementById('userInput');
        
        if (userInput) {
            userInput.disabled = false;
            userInput.placeholder = 'Ask a question about this page...';
        }
        
        if (sendBtn) {
            sendBtn.disabled = false;
        }
    }

    disableChatInterface() {
        const sendBtn = document.getElementById('sendBtn');
        const userInput = document.getElementById('userInput');
        
        if (userInput) {
            userInput.disabled = true;
            userInput.placeholder = 'Cannot analyze this page type';
        }
        
        if (sendBtn) {
            sendBtn.disabled = true;
        }
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

window.sidebarApp = new SidebarApp();
