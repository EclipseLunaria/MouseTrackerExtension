document.addEventListener("DOMContentLoaded", () => {
    const toggleLogging = document.getElementById("toggleLogging");
    const showEvents = document.getElementById("showEvents");
    const eventsContainer = document.getElementById("events");
    const downloadEvents = document.getElementById("downloadEvents");
  
    // Load the current logging state
    chrome.storage.local.get({ loggingEnabled: false }, (result) => {
      toggleLogging.checked = result.loggingEnabled;
    });
  
    // Handle the download events button click
    downloadEvents.addEventListener("click", () => {
      chrome.runtime.sendMessage({ type: "get_events" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
        } else {
          const events = response.events;
          if (events.length > 0) {
            const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const filename = `events_${Date.now()}.json`;
            chrome.downloads.download({ url: url, filename: filename, saveAs: true });
          } else {
            console.log("No events to download");
          }
        }
      });
    });
  
    // Toggle the logging state
    toggleLogging.addEventListener("change", () => {
      const loggingEnabled = toggleLogging.checked;
      chrome.storage.local.set({ loggingEnabled: loggingEnabled }, () => {
        chrome.runtime.sendMessage({ type: "toggle_logging", loggingEnabled: loggingEnabled }, (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
          } else {
            console.log(response.status);
          }
        });
      });
    });
  
    // Show logged events
    showEvents.addEventListener("click", () => {
      chrome.storage.local.get({ events: [] }, (result) => {
        eventsContainer.textContent = JSON.stringify(result.events, null, 2);
      });
    });
  });
  