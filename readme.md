# Session Tracker Extension
## Overview
**Session Tracker** is a Chrome extension that allows users to:

- Save all open tabs (a session) into a named list.
- View and manage saved sessions.
- Open all tabs from a saved session with one click.  

## Features
- Save the current session of open tabs.
- List all saved sessions in the popup interface.
- Reopen tabs from a selected session.

## Installation
1. Clone or download this repository to your local machine.
2. Open **Chrome** and navigate to chrome://extensions.
3. Enable **Developer Mode** (toggle in the top right corner).
4. Click on **Load unpacked** and select the extension's directory.
5. The extension will now appear in your Chrome toolbar.

## Usage
1. **Save Current Session**:
   - Click on the extension icon to open the popup.
   - Press the "Save Current Session" button to save all currently open tabs.

2. **View Sessions**:

   - Saved sessions will appear as a list in the popup.
   - Each session is labeled (e.g., "Session 1").

3. Open a Session:

   - Click on a session in the list to reopen all its tabs.

## File Structure
```bash
Session-Tracker/
│
├── manifest.json          # Extension configuration
├── background.js          # Background script for handling actions
├── popup.html             # HTML for the popup interface
├── popup.js               # JavaScript for the popup functionality
├── styles.css             # Optional stylesheet for styling the popup
└── icons/                 # Icons for the extension
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```
## Permissions
The following permissions are required:

- **Tabs**: To access information about open tabs.
- **Storage**: To save session data locally.

## Content Security Policy
The extension uses a strict Content Security Policy ( ``` content_security_policy.extension_pages ``` ) to ensure security and prevent inline scripts.

## Known Issues
- Sessions are stored locally and cannot be synced across devices.
- Tabs cannot be reopened in incognito mode unless explicitly enabled in the extension settings.
## License
This project is open-source and licensed under the MIT License.