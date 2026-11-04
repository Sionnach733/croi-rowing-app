import { Component, computed, inject } from '@angular/core';
import { GoogleMap, MapAdvancedMarker, MapPolyline } from '@angular/google-maps';
import along from '@turf/along';
import { lineString } from '@turf/helpers';
import length from '@turf/length';
import { config } from '../config';
import { PmDataService } from '../pm-data.service';
import { getGeoJsonData } from './shannon';

const coordinates = getGeoJsonData().features[0].geometry.coordinates as [number, number][];
const shannon = lineString(coordinates);
const SHANNON_KM = length(shannon, { units: 'kilometers' });

/** Kilometres along the Shannon, restarting from the source after each full length. */
export function kilometresAlongShannon(totalMetres: number, routeKm = SHANNON_KM): number {
  return (totalMetres / 1000) % routeKm;
}

@Component({
  selector: 'app-my-map',
  imports: [GoogleMap, MapPolyline, MapAdvancedMarker],
  templateUrl: './my-map.html',
  styleUrl: './my-map.css',
})
export class MyMap {
  private readonly pmData = inject(PmDataService);

  readonly center: google.maps.LatLngLiteral = { lat: 53.424266, lng: -7.921739 };
  readonly options: google.maps.MapOptions = {
    mapId: config.MAPS_ID,
    mapTypeId: 'terrain',
  };
  readonly path = coordinates.map(([lng, lat]) => ({ lat, lng }));
  readonly lineOptions: google.maps.PolylineOptions = {
    clickable: false,
    strokeColor: 'red',
    strokeWeight: 2,
  };

  readonly position = computed<google.maps.LatLngLiteral>(() => {
    const km = kilometresAlongShannon(this.pmData.totalDistance());
    const [lng, lat] = along(shannon, km, { units: 'kilometers' }).geometry.coordinates;
    return { lat, lng };
  });
}
