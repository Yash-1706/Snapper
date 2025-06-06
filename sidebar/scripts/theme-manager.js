// Theme Manager - Fixed version
class ThemeManager {
    constructor() {
        this.currentTheme = 'monokai';
        this.themeToggle = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.themeToggle = document.getElementById('themeToggle');
            this.loadSavedTheme();
            this.setupEventListeners();
        });
    }

    setupEventListeners() {
        if (this.themeToggle) {
            // DON'T call this.themeToggle() - it's a DOM element, not a function
            // Instead, add event listener
            this.themeToggle.addEventListener('click', () => {
                this.toggleTheme(); // Call the method, not the element
            });
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'monokai' ? 'light' : 'monokai';
        this.applyTheme();
        this.saveTheme();
        this.updateThemeIcon();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        document.body.setAttribute('data-theme', this.currentTheme);
    }

    updateThemeIcon() {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = this.currentTheme === 'monokai' ? '☀️' : '🌙';
        }
    }

    saveTheme() {
        chrome.storage.local.set({ theme: this.currentTheme });
    }

    loadSavedTheme() {
        chrome.storage.local.get(['theme'], (result) => {
            if (result.theme) {
                this.currentTheme = result.theme;
                this.applyTheme();
                this.updateThemeIcon();
            }
        });
    }
}

// Initialize theme manager
new ThemeManager();
