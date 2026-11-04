import along from '@turf/along';
import { lineString } from '@turf/helpers';
import length from '@turf/length';
import lineSliceAlong from '@turf/line-slice-along';
import { getGeoJsonData } from './route-map/shannon';

export type LatLng = { lat: number; lng: number };

const coordinates = getGeoJsonData().features[0].geometry.coordinates as [number, number][];
const route = lineString(coordinates);
const toLatLng = ([lng, lat]: number[]): LatLng => ({ lat, lng });

/** Length of the Shannon route in kilometres. */
export const SHANNON_KM = length(route, { units: 'kilometers' });

/** The full route as map points, source to mouth. */
export const SHANNON_PATH: LatLng[] = coordinates.map(toLatLng);

/** Kilometres along the Shannon, restarting from the source after each full length. */
export function kilometresAlongShannon(totalMetres: number, routeKm = SHANNON_KM): number {
  return (totalMetres / 1000) % routeKm;
}

/** How many full-and-partial lengths of the Shannon the team has rowed. */
export function lengthsOfShannon(totalMetres: number, routeKm = SHANNON_KM): number {
  return totalMetres / 1000 / routeKm;
}

/** Point on the river for a position along the current length. */
export function pointAlongShannon(km: number): LatLng {
  return toLatLng(along(route, km, { units: 'kilometers' }).geometry.coordinates);
}

/** The part of the river already covered on the current length. */
export function pathRowed(km: number): LatLng[] {
  if (km <= 0) return [SHANNON_PATH[0]];
  return lineSliceAlong(route, 0, km, { units: 'kilometers' }).geometry.coordinates.map(toLatLng);
}
