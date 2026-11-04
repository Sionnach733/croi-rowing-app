import { Component, computed, inject } from '@angular/core';
import { GoogleMap, MapAdvancedMarker, MapPolyline } from '@angular/google-maps';
import { config } from '../config';
import { PmDataService } from '../pm-data.service';
import {
  kilometresAlongShannon,
  pathRowed,
  pointAlongShannon,
  SHANNON_PATH,
} from '../shannon-route';

@Component({
  selector: 'app-route-map',
  imports: [GoogleMap, MapPolyline, MapAdvancedMarker],
  templateUrl: './route-map.html',
  styleUrl: './route-map.css',
})
export class RouteMap {
  private readonly pmData = inject(PmDataService);

  readonly center = { lat: 53.2, lng: -8.3 };
  readonly options: google.maps.MapOptions = {
    mapId: config.MAPS_ID,
    colorScheme: 'DARK',
    // Raster tiles don't need WebGL, so the map also renders on low-powered TV browsers.
    renderingType: 'RASTER',
    disableDefaultUI: true,
    gestureHandling: 'none',
    keyboardShortcuts: false,
    clickableIcons: false,
  };

  readonly fullPath = SHANNON_PATH;
  readonly remainingLine: google.maps.PolylineOptions = {
    clickable: false,
    strokeColor: '#8a97a8',
    strokeOpacity: 0.55,
    strokeWeight: 3,
  };
  readonly rowedLine: google.maps.PolylineOptions = {
    clickable: false,
    strokeColor: '#c6f432',
    strokeOpacity: 1,
    strokeWeight: 5,
    zIndex: 1,
  };

  private readonly km = computed(() => kilometresAlongShannon(this.pmData.totalDistance()));
  readonly rowedPath = computed(() => pathRowed(this.km()));
  readonly position = computed(() => pointAlongShannon(this.km()));

  /** Custom marker: a glowing dot, styled in route-map.css. */
  readonly markerContent = createMarker();

  fitRoute(map: google.maps.Map) {
    const bounds = new google.maps.LatLngBounds();
    SHANNON_PATH.forEach((p) => bounds.extend(p));
    map.fitBounds(bounds, 48);
  }
}

function createMarker(): HTMLElement {
  const el = document.createElement('div');
  el.className = 'boat-marker';
  return el;
}
