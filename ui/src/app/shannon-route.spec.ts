import { getGeoJsonData } from './route-map/shannon';
import {
  kilometresAlongShannon,
  lengthsOfShannon,
  pathRowed,
  pointAlongShannon,
  SHANNON_KM,
  SHANNON_PATH,
} from './shannon-route';

const coords = getGeoJsonData().features[0].geometry.coordinates as number[][];
const [srcLng, srcLat] = coords[0];
const [mouthLng, mouthLat] = coords[coords.length - 1];

describe('shannon-route', () => {
  it('measures a plausible length for the Shannon', () => {
    expect(SHANNON_KM).toBeGreaterThan(300);
    expect(SHANNON_KM).toBeLessThan(420);
  });

  it('exposes the route as lat/lng points', () => {
    expect(SHANNON_PATH.length).toBe(coords.length);
    expect(SHANNON_PATH[0]).toEqual({ lat: srcLat, lng: srcLng });
  });

  describe('kilometresAlongShannon', () => {
    it('converts metres to kilometres on the first length', () => {
      expect(kilometresAlongShannon(0, 360)).toBe(0);
      expect(kilometresAlongShannon(150_000, 360)).toBe(150);
    });

    it('restarts from the source after each full length', () => {
      expect(kilometresAlongShannon(360_000, 360)).toBe(0);
      expect(kilometresAlongShannon(400_000, 360)).toBe(40);
      expect(kilometresAlongShannon(730_000, 360)).toBe(10);
    });

    it('defaults to the real route length', () => {
      expect(kilometresAlongShannon(SHANNON_KM * 1000 + 5_000)).toBeCloseTo(5, 6);
    });
  });

  it('counts lengths of the Shannon rowed', () => {
    expect(lengthsOfShannon(0, 360)).toBe(0);
    expect(lengthsOfShannon(540_000, 360)).toBe(1.5);
  });

  describe('pointAlongShannon', () => {
    it('is at the source at 0 km and the mouth at the full length', () => {
      const start = pointAlongShannon(0);
      expect(start.lat).toBeCloseTo(srcLat, 5);
      expect(start.lng).toBeCloseTo(srcLng, 5);
      const end = pointAlongShannon(SHANNON_KM);
      expect(end.lat).toBeCloseTo(mouthLat, 4);
      expect(end.lng).toBeCloseTo(mouthLng, 4);
    });
  });

  describe('pathRowed', () => {
    it('is just the source before any rowing', () => {
      expect(pathRowed(0)).toEqual([SHANNON_PATH[0]]);
    });

    it('runs from the source to the current position', () => {
      const path = pathRowed(100);
      const here = pointAlongShannon(100);
      expect(path[0].lat).toBeCloseTo(srcLat, 5);
      expect(path.at(-1)!.lat).toBeCloseTo(here.lat, 5);
      expect(path.at(-1)!.lng).toBeCloseTo(here.lng, 5);
      expect(path.length).toBeLessThan(SHANNON_PATH.length);
    });

    it('grows as distance increases', () => {
      expect(pathRowed(200).length).toBeGreaterThan(pathRowed(50).length);
    });
  });
});
