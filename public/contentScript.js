// Content script for PDF text selection
console.log('LinguaLink content script loaded');

// Create a global variable that can be accessed from the popup
window.lingualinkSelectedText = '';
window.lingualinkLastUpdate = 0;

function handleTextSelection() {
    const newText = window.getSelection().toString().trim();

    if (newText && newText.length > 1) {
        window.lingualinkSelectedText = newText;
        window.lingualinkLastUpdate = Date.now();

        console.log('📖 Text selected:', newText);
        console.log('🕒 Selection timestamp:', window.lingualinkLastUpdate);

        // Visual feedback (optional)
        showSelectionFeedback(newText);
    }
}

function showSelectionFeedback(text) {
    // Remove existing feedback if any
    const existingFeedback = document.getElementById('lingualink-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }

    // Create visual feedback
    const feedback = document.createElement('div');
    feedback.id = 'lingualink-feedback';
    feedback.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4a6fa5;
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 10000;
            font-size: 14px;
            max-width: 300px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        ">
            <strong>LinguaLink:</strong> Text selected!<br>
            <small>Click extension icon to translate</small>
        </div>
    `;

    document.body.appendChild(feedback);

    // Remove after 3 seconds
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.remove();
        }
    }, 3000);
}

// Event listeners
document.addEventListener('mouseup', handleTextSelection);
document.addEventListener('keyup', handleTextSelection);
document.addEventListener('selectionchange', handleTextSelection);

// Special handling for PDF viewers
if (document.querySelector('embed[type="application/pdf"]') ||
    window.location.href.includes('.pdf')) {

    console.log('PDF viewer detected');

    // Additional listener for PDF viewer
    const viewer = document.querySelector('#viewer') || document.body;
    viewer.addEventListener('mouseup', handleTextSelection);

    // Periodic check for PDF viewers that don't trigger events properly
    setInterval(() => {
        const currentText = window.getSelection().toString().trim();
        if (currentText && currentText !== window.lingualinkSelectedText) {
            handleTextSelection();
        }
    }, 1000);
}

console.log('LinguaLink content script ready');