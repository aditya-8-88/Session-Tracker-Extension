document.addEventListener('DOMContentLoaded', () => {
  const saveSessionButton = document.getElementById('saveSession');
  const clearSessionsButton = document.getElementById('clearSessions');
  const sessionList = document.getElementById('sessionList');
  const modal = document.getElementById('sessionModal');
  let selectedSessionId = null; // Store the selected session ID
  let isEditMode = false; // Flag to indicate if we're in edit mode

  // Save current session
  saveSessionButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'saveSession' });
    location.reload(); // Refresh to show the new session
  });

  // Clear all sessions
  clearSessionsButton.addEventListener('click', () => {
    chrome.storage.local.set({ sessions: [] });
    location.reload(); // Refresh to clear sessions
  });

  // Fetch saved sessions from local storage
  chrome.storage.local.get(['sessions'], (result) => {
    const sessions = result.sessions || [];
    sessionList.innerHTML = ''; // Clear the session list

    sessions.forEach(session => {
      const li = document.createElement('li');
      li.classList.add('session-item');

      // Display formatted date and time
      const date = new Date(session.id.replace('session_', ''));
      const dateStr = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;

      // Create elements for displaying session information
      const dateLabel = document.createElement('span');
      dateLabel.textContent = dateStr;
      dateLabel.style.marginRight = '6px';

      const nameSpan = document.createElement('span');
      nameSpan.textContent = session.name || 'Session';
      nameSpan.style.marginRight = '6px';

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.className = 'button is-small is-info';
      editBtn.style.marginRight = '5px';

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.className = 'remove-session button is-small is-danger';

      // Edit button logic
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent modal from opening
        enterEditMode(li, session);
      });

      // Remove button logic
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent modal from opening
        chrome.storage.local.get(['sessions'], (result) => {
          const updatedSessions = result.sessions.filter(s => s.id !== session.id);
          chrome.storage.local.set({ sessions: updatedSessions });
          location.reload(); // Refresh the session list
        });
      });

      li.appendChild(dateLabel);
      li.appendChild(nameSpan);
      li.appendChild(editBtn);
      li.appendChild(removeBtn);

      // Click listener for session (open modal)
      li.addEventListener('click', (event) => {
        if (!isEditMode) {
          selectedSessionId = session.id; // Store the session ID
          showModal(); // Show the modal
        }
      });

      sessionList.appendChild(li);
    });
  });

  // Show modal function
  function showModal() {
    modal.classList.add('is-active');
  }

  // Hide modal function
  function hideModal() {
    modal.classList.remove('is-active');
  }

  // Handle modal actions
  document.getElementById('openCurrent').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'loadSession', sessionId: selectedSessionId });
    hideModal(); // Close the modal
  });

  document.getElementById('openNew').addEventListener('click', () => {
    chrome.windows.create({}, function (window) {
      chrome.runtime.sendMessage({ action: 'loadSession', sessionId: selectedSessionId });
    });
    hideModal(); // Close the modal
  });

  document.getElementById('cancelModal').addEventListener('click', hideModal);
  document.querySelector('.modal-close').addEventListener('click', hideModal);

  // Function to enter edit mode
  function enterEditMode(li, session) {
    isEditMode = true; // Set edit mode flag
    const dateSpan = li.querySelector('span:nth-child(1)');
    dateSpan.style.display = 'none'; // Hide the date span

    const nameSpan = li.querySelector('span:nth-child(2)');
    const editBtn = li.querySelector('button');

    const input = document.createElement('input');
    input.type = 'text';
    input.value = nameSpan.textContent;
    input.style.width = '30vw';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.className = 'button is-small is-success';

    li.replaceChild(input, nameSpan);
    li.replaceChild(saveBtn, editBtn);

    input.focus(); // Focus the input field for immediate editing

    // Save button logic
    saveBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent modal from opening
      session.name = input.value;
      chrome.storage.local.get(['sessions'], (result) => {
        const updatedSessions = result.sessions.map(s => (s.id === session.id ? session : s));
        chrome.storage.local.set({ sessions: updatedSessions });
        isEditMode = false; // Exit edit mode
        location.reload(); // Refresh to reflect the updated session name
      });
    });
  }
});
