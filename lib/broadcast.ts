// Utility for cross-tab communication
export const broadcastToAllTabs = (eventType: string, data: Record<string, unknown>) => {
  // Store in localStorage (triggers storage event in other tabs)
  localStorage.setItem(`broadcast_${eventType}`, JSON.stringify({
    ...data,
    timestamp: Date.now()
  }));
  
  // Dispatch custom event for same tab
  window.dispatchEvent(new CustomEvent(eventType, { 
    detail: data 
  }));
  
  // Clean up the broadcast message after a short delay
  setTimeout(() => {
    localStorage.removeItem(`broadcast_${eventType}`);
  }, 1000);
};

export const listenForBroadcasts = (eventType: string, callback: (data: unknown) => void) => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === `broadcast_${eventType}` && e.newValue) {
      const data = JSON.parse(e.newValue);
      callback(data);
    }
  };

  const handleCustomEvent = (e: CustomEvent) => {
    callback(e.detail);
  };

  window.addEventListener('storage', handleStorageChange);
  window.addEventListener(eventType, handleCustomEvent as EventListener);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener(eventType, handleCustomEvent as EventListener);
  };
};
