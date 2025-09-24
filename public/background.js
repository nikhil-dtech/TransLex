// Background script
console.log('LinguaLink background script loaded');

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
    console.log('LinguaLink extension installed');

    // Set default settings
    chrome.storage.sync.set({
        primaryLanguage: 'hi',
        secondaryLanguages: ['es', 'fr'],
        translationService: 'google',
        enableFileProtocol: true
    });
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request);

    if (request.action === 'textSelected') {
        // Store the selected text
        chrome.storage.local.set({
            lastSelectedText: request.text,
            sourceUrl: request.url
        });

        // Send notification to popup if it's open
        chrome.runtime.sendMessage({
            action: 'newTextAvailable',
            text: request.text
        }).catch(error => {
            // This is normal - popup might not be open
        });

        sendResponse({ status: 'text_received' });
    }

    return true; // Keep message channel open for async response
});