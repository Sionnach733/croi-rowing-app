import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { config } from './app/config';

/** Load the Google Maps JS API once, before the app starts. */
function loadGoogleMaps(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const callbackName = '__onGoogleMapsLoaded';
    (window as unknown as Record<string, () => void>)[callbackName] = () => resolve();
    const script = document.createElement('script');
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}` +
      `&libraries=marker&loading=async&callback=${callbackName}`;
    script.async = true;
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    document.head.appendChild(script);
  });
}

loadGoogleMaps(config.MAPS_KEY)
  .catch((err) => console.error(err))
  .then(() => bootstrapApplication(App, appConfig))
  .catch((err) => console.error(err));
