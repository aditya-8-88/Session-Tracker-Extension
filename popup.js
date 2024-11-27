document.addEventListener('DOMContentLoaded', () => {
    // Event listener for saving the current session
    document.getElementById('saveSession').addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'saveSession' });
    });
  
    // Fetch saved sessions from local storage
    chrome.storage.local.get(['sessions'], (result) => {
      const sessions = result.sessions || [];
      const sessionList = document.getElementById('sessionList');
      sessionList.innerHTML = ''; // Clear the session list
      sessions.forEach(session => {
        const li = document.createElement('li');
        li.textContent = session.id;  // Display session ID
        li.addEventListener('click', () => {
          // Load and open all URLs of the clicked session
          chrome.runtime.sendMessage({ action: 'loadSession', sessionId: session.id });
        });
        sessionList.appendChild(li);
      });
    });
  });
  