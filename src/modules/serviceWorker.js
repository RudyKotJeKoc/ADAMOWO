const SERVICE_WORKER_PATH = '/sw.js';

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker
    .register(SERVICE_WORKER_PATH)
    .then((registration) => {
      console.log('✓ Service Worker registered:', registration);
    })
    .catch((error) => {
      console.warn('Service Worker registration failed:', error);
    });
}
