// Content Script 
class ContentExtractor {
    constructor() {
        this.isReady = false;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setup();
            });
        } else {
            this.setup();
        }
    }

    setup() {
        this.isReady = true;
        this.setupMessageListener();
        console.log('Content script ready on:', window.location.href);
    }

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            console.log('Content script received message:', request);
            
            if (request.action === 'extractContent') {
                this.extractContent(request.mode)
                    .then(content => {
                        console.log('Content extracted successfully');
                        sendResponse({ success: true, content });
                    })
                    .catch(error => {
                        console.error('Content extraction failed:', error);
                        sendResponse({ success: false, error: error.message });
                    });
                return true; // Keep message channel open for async response
            }
            
            // Health check
            if (request.action === 'ping') {
                sendResponse({ success: true, message: 'Content script is ready' });
            }
        });
    }

    async extractContent(mode = 'fullPage') {
        if (!this.isReady) {
            throw new Error('Content script not ready');
        }

        try {
            const content = this.extractFullPageContent();
            
            return {
                url: window.location.href,
                title: document.title,
                content: content,
                mode: mode,
                timestamp: new Date().toISOString(),
                wordCount: content.split(' ').length
            };
        } catch (error) {
            throw new Error('Failed to extract content: ' + error.message);
        }
    }

    extractFullPageContent() {
        // Try multiple strategies to get content
        let content = '';
        
        // Strategy 1: Get main content areas
        const mainSelectors = [
            'main',
            'article', 
            '[role="main"]',
            '.content',
            '#content',
            '.main-content'
        ];
        
        for (const selector of mainSelectors) {
            const element = document.querySelector(selector);
            if (element && element.innerText.trim().length > 100) {
                content = element.innerText.trim();
                break;
            }
        }
        
        // Strategy 2: If no main content found, get all paragraphs and headings
        if (!content) {
            const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, div');
            const textParts = [];
            
            textElements.forEach(el => {
                const text = el.innerText?.trim();
                if (text && text.length > 20 && !this.isNavigationText(text)) {
                    textParts.push(text);
                }
            });
            
            content = textParts.join('\n\n');
        }
        
        // Strategy 3: Fallback to body text
        if (!content || content.length < 100) {
            content = document.body.innerText?.trim() || '';
        }
        
        // Clean up the content
        content = this.cleanContent(content);
        
        if (!content || content.length < 50) {
            throw new Error('No meaningful content found on this page');
        }
        
        return content;
    }

    isNavigationText(text) {
        const navWords = ['menu', 'navigation', 'nav', 'header', 'footer', 'sidebar', 'login', 'register', 'sign in', 'sign up'];
        return navWords.some(word => text.toLowerCase().includes(word)) && text.length < 100;
    }

    cleanContent(content) {
        return content
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/\n\s*\n/g, '\n\n') // Replace multiple newlines with double newline
            .trim();
    }
}

// Initialize content extractor
new ContentExtractor();
