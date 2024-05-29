function sendMessageToBackground(message) {
    try {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
        } else {
          console.log(response.status);
        }
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
  
  // Existing event listeners for mouse and keyboard events
  document.addEventListener('mousemove', (event) => {
    sendMessageToBackground({
      type: 'mousemove',
      x: event.clientX,
      y: event.clientY,
      timestamp: Date.now()
    });
  });
  
  document.addEventListener('click', (event) => {
    sendMessageToBackground({
      type: 'click',
      x: event.clientX,
      y: event.clientY,
      timestamp: Date.now()
    });
  });
  
  document.addEventListener('keydown', (event) => {
    sendMessageToBackground({
      type: 'keydown',
      key: event.key,
      timestamp: Date.now()
    });
  });
  
  document.addEventListener('keyup', (event) => {
    sendMessageToBackground({
      type: 'keyup',
      key: event.key,
      timestamp: Date.now()
    });
  });
  
  // New event listener for visibility change
  document.addEventListener('visibilitychange', () => {
    sendMessageToBackground({
      type: 'visibilitychange',
      visibilityState: document.visibilityState,
      timestamp: Date.now()
    });
  });