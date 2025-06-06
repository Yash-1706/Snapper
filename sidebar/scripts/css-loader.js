// CSS Loader - Load stylesheets dynamically
(function() {
    // Load Google Fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preconnect';
    fontLink.href = 'https://fonts.googleapis.com';
    document.head.appendChild(fontLink);
    
    const fontLink2 = document.createElement('link');
    fontLink2.rel = 'preconnect';
    fontLink2.href = 'https://fonts.gstatic.com';
    fontLink2.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink2);
    
    const fontStylesheet = document.createElement('link');
    fontStylesheet.rel = 'stylesheet';
    fontStylesheet.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(fontStylesheet);

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
    
    document.addEventListener('DOMContentLoaded', function() {
        document.body.setAttribute('data-theme', 'monokai');
        document.documentElement.setAttribute('data-theme', 'monokai');
    });
})();
