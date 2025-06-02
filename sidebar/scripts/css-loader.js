// CSS Loader - Load stylesheets dynamically
(function() {
    const cssFiles = [
        'styles/main.css',
        'styles/themes/monokai.css',
        'styles/components/sidebar.css',
        'styles/components/chat.css',
        'styles/components/controls.css',
        'styles/components/animations.css'
    ];

    cssFiles.forEach(file => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = chrome.runtime.getURL(file);
        document.head.appendChild(link);
    });

    // Force Monokai theme immediately
    document.documentElement.setAttribute('data-theme', 'monokai');
    
    // Also set it when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        document.body.setAttribute('data-theme', 'monokai');
        document.documentElement.setAttribute('data-theme', 'monokai');
    });
})();
