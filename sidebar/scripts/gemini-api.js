// Gemini API Integration - Using environment variables
class GeminiAPI {
    constructor() {
        this.apiKeys = [];
        this.currentKeyIndex = 0;
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
        this.loadAPIKeys();
    }

    async loadAPIKeys() {
        try {
            // First try to load from Chrome storage (for production)
            const result = await chrome.storage.local.get(['geminiApiKeys']);
            if (result.geminiApiKeys && result.geminiApiKeys.length > 0) {
                this.apiKeys = result.geminiApiKeys;
                console.log('✅ API keys loaded from storage');
                return;
            }

            // Fallback: Load from environment variables for development
            await this.loadFromEnvironment();
            
        } catch (error) {
            console.error('Failed to load API keys:', error);
            await this.loadFromEnvironment();
        }
    }

    async loadFromEnvironment() {
        // This method will be used during development
        // In production, you'll set keys via the extension popup
        const keys = [];
        
        // Try to load from injected environment variables
        if (typeof EXTENSION_CONFIG !== 'undefined') {
            if (EXTENSION_CONFIG.GEMINI_KEY_1) keys.push(EXTENSION_CONFIG.GEMINI_KEY_1);
            if (EXTENSION_CONFIG.GEMINI_KEY_2) keys.push(EXTENSION_CONFIG.GEMINI_KEY_2);
            if (EXTENSION_CONFIG.GEMINI_KEY_3) keys.push(EXTENSION_CONFIG.GEMINI_KEY_3);
            if (EXTENSION_CONFIG.GEMINI_KEY_4) keys.push(EXTENSION_CONFIG.GEMINI_KEY_4);
            if (EXTENSION_CONFIG.GEMINI_KEY_5) keys.push(EXTENSION_CONFIG.GEMINI_KEY_5);
        }

        if (keys.length > 0) {
            this.apiKeys = keys;
            console.log(`✅ Loaded ${keys.length} API key(s) from environment`);
        } else {
            console.warn('⚠️ No API keys found. Please configure them.');
        }
    }

    async setAPIKeys(keys) {
        this.apiKeys = keys.filter(key => key && key.startsWith('AIzaSy'));
        await chrome.storage.local.set({ geminiApiKeys: this.apiKeys });
        console.log(`✅ Saved ${this.apiKeys.length} API key(s) to storage`);
    }

    getCurrentKey() {
        if (this.apiKeys.length === 0) {
            throw new Error('No API keys available - Please configure your Gemini API keys');
        }
        return this.apiKeys[this.currentKeyIndex];
    }

    async generateResponse(prompt, context) {
        if (this.apiKeys.length === 0) {
            throw new Error('Gemini API key not configured - Please set your API keys');
        }

        const fullPrompt = this.buildPrompt(prompt, context);
        console.log('🔄 Calling Gemini API...');
        
        try {
            const response = await fetch(`${this.baseURL}?key=${this.getCurrentKey()}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: fullPrompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                })
            });

            console.log('📡 API Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ API Error Details:', errorData);
                throw new Error(`HTTP ${response.status}: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ API Response received successfully');
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                console.error('❌ Invalid response format:', data);
                throw new Error('Invalid response format from Gemini API');
            }
        } catch (error) {
            console.error('❌ Gemini API error:', error);
            throw error;
        }
    }

    buildPrompt(userPrompt, context) {
        const truncatedContent = this.truncateContent(context.content, 20000);
        
        return `Based on the following web page content, please ${userPrompt}

Web Page Information:
- Title: ${context.title}
- URL: ${context.url}

Content:
${truncatedContent}

Please provide a clear, well-formatted response with proper paragraphs and structure.`;
    }

    truncateContent(content, maxChars) {
        if (content.length <= maxChars) {
            return content;
        }
        
        const truncated = content.substring(0, maxChars);
        const lastSpace = truncated.lastIndexOf(' ');
        return truncated.substring(0, lastSpace) + '\n\n[Content truncated due to length...]';
    }
}

window.geminiAPI = new GeminiAPI();
