// Theme Manager - Dark theme only for v0
class ThemeManager {
    constructor() {
        this.currentTheme = 'monokai';
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.applyTheme();
            this.setupEventListeners();
        });
    }

    setupEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            // Theme toggle now just shows a fun animation
            themeToggle.addEventListener('click', () => {
                this.playAnimation();
            });
        }
    }

    playAnimation() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1)';
            }, 150);
        }
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', 'monokai');
        document.body.setAttribute('data-theme', 'monokai');
    }
}

// Initialize theme manager
new ThemeManager();
