// This can be used to track URLs when the user navigates to a page, if required
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getVisitedUrls') {
      sendResponse({ urls: [window.location.href] });
    }
  });
  