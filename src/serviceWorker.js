const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
      /^192\.168\.\d+\.\d+$/
    )
  );
  
  export function register() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        const swUrl = '/service-worker.js';
        
        if (isLocalhost) {
          checkValidServiceWorker(swUrl);
          navigator.serviceWorker.ready.then(() => {
            console.log('This web app is being served cache-first by a service worker.');
          });
        } else {
          registerValidSW(swUrl);
        }
      });
    }
  }
  
  function registerValidSW(swUrl) {
    navigator.serviceWorker.register(swUrl).then(registration => {
      console.log('Service Worker has been registered.');
    }).catch(error => {
      console.error('Error during service worker registration:', error);
    });
  }
  
  function checkValidServiceWorker(swUrl) {
    fetch(swUrl)
      .then(response => {
        if (
          response.status === 404 ||
          response.headers.get('content-type').indexOf('javascript') === -1
        ) {
          navigator.serviceWorker.ready.then(registration => {
            registration.unregister().then(() => {
              window.location.reload();
            });
          });
        } else {
          registerValidSW(swUrl);
        }
      })
      .catch(() => {
        console.log('No internet connection found. App is running in offline mode.');
      });
  }
  