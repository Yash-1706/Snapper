// UI Controller - Handle input interactions
document.addEventListener('DOMContentLoaded', function() {
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const quickActionsToggle = document.getElementById('quickActionsToggle');
    const quickActionsContent = document.getElementById('quickActionsContent');

    // Auto-resize textarea
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        
        // Enable/disable send button based on content
        sendBtn.disabled = this.value.trim().length === 0;
    });

    // Handle Enter key
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (this.value.trim() && !sendBtn.disabled) {
                console.log('Sending message:', this.value);
                this.value = '';
                this.style.height = 'auto';
                sendBtn.disabled = true;
            }
        }
    });

    // Send button click
    sendBtn.addEventListener('click', function() {
        if (userInput.value.trim() && !this.disabled) {
            console.log('Sending message:', userInput.value);
            userInput.value = '';
            userInput.style.height = 'auto';
            this.disabled = true;
        }
    });

    // Quick actions toggle
    quickActionsToggle.addEventListener('click', function() {
        const isExpanded = quickActionsContent.style.display !== 'none';
        quickActionsContent.style.display = isExpanded ? 'none' : 'grid';
        
        const arrow = this.querySelector('.toggle-arrow');
        arrow.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
    });

    // Quick action buttons
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const prompt = this.getAttribute('data-prompt');
            userInput.value = prompt;
            userInput.style.height = 'auto';
            userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
            sendBtn.disabled = false;
            userInput.focus();
        });
    });
});
