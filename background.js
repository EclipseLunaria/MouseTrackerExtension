chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension Installed");
    chrome.storage.local.set({ loggingEnabled: false, events: [] });
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "toggle_logging") {
      chrome.storage.local.set({ loggingEnabled: message.loggingEnabled }, () => {
        sendResponse({ status: "Logging state updated" });
      });
      return true;
    } else if (message.type === "get_events") {
      chrome.storage.local.get({ events: [] }, (result) => {
        sendResponse({ events: result.events });
      });
      return true;
    } else {
      chrome.storage.local.get({ events: [], loggingEnabled: false }, (result) => {
        if (result.loggingEnabled) {
          const events = result.events;
          events.push({
            type: message.type,
            data: message,
            timestamp: Date.now()
          });
          chrome.storage.local.set({ events: events }, () => {
            sendResponse({ status: "Event logged" });
          });
        } else {
          sendResponse({ status: "Logging disabled" });
        }
      });
      return true;
    }
  });
  
  chrome.runtime.onSuspend.addListener(() => {
    // Trigger download of logged events
    chrome.storage.local.get({ events: [] }, (result) => {
      const events = result.events;
      if (events.length > 0) {
        const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const filename = `events_${Date.now()}.json`;
        chrome.downloads.download({ url: url, filename: filename, saveAs: true });
      }
    });
  });
  