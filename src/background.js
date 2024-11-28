let currentSession = [];

chrome.runtime.onInstalled.addListener(() => {
    // Initialize storage for sessions if not already present
    chrome.storage.local.get(['sessions'], (result) => {
        if (!result.sessions) {
            chrome.storage.local.set({ sessions: [] });
        }
    });
});

// Listen for saving or loading a session
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'saveSession') {
        saveSession();
    } else if (message.action === 'loadSession') {
        loadSession(message.sessionId);
    }
});

function saveSession() {
    // Get all open URLs in the current window
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
        const urls = tabs.map(tab => tab.url);
        chrome.storage.local.get(['sessions'], (result) => {
            let sessions = result.sessions || [];
            const sessionId = `session_${new Date().toISOString()}`; // Unique session ID
            sessions.push({ id: sessionId, urls });
            chrome.storage.local.set({ sessions });
            // background.js
            console.log('This is a debug message');

        });
    });
}

function loadSession(sessionId) {
    chrome.storage.local.get(['sessions'], (result) => {
        const session = result.sessions.find(s => s.id === sessionId);
        if (session) {
            // Open each URL of the selected session in a new tab
            session.urls.forEach(url => {
                chrome.tabs.create({ url });
            });
        } else {
            // background.js
            console.log('This is a debug message');

        }
    });
}
