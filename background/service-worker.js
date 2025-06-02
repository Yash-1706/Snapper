// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
    try {
        // Open the side panel
        await chrome.sidePanel.open({windowId: tab.windowId});
    } catch (error) {
        console.error('Error opening sidebar:', error);
    }
});

// Handle keyboard shortcut
chrome.commands.onCommand.addListener(async (command) => {
    if (command === 'open-sidebar') {
        try {
            const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
            await chrome.sidePanel.open({windowId: tab.windowId});
        } catch (error) {
            console.error('Error opening sidebar:', error);
        }
    }
});

console.log('Snapper extension loaded');
