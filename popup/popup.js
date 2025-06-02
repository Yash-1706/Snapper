// popup.js - Handle popup interactions
document.addEventListener('DOMContentLoaded', function() {
    const openButton = document.getElementById('openSidebar');
    
    openButton.addEventListener('click', async function() {
        try {
            // Get the current window
            const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
            
            // Open the side panel
            await chrome.sidePanel.open({windowId: tab.windowId});
            
            // Close the popup
            window.close();
        } catch (error) {
            console.error('Error opening sidebar:', error);
        }
    });
});
