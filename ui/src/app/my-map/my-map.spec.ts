import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoogleMap, MapAdvancedMarker, MapPolyline } from '@angular/google-maps';
import length from '@turf/length';
import { lineString } from '@turf/helpers';
import { PmDataService } from '../pm-data.service';
import { FakePmDataService } from '../testing';
import { kilometresAlongShannon, MyMap } from './my-map';
import { getGeoJsonData } from './shannon';

const coords = getGeoJsonData().features[0].geometry.coordinates as [number, number][];
const routeKm = length(lineString(coords), { units: 'kilometers' });

describe('kilometresAlongShannon', () => {
  it('converts metres to kilometres on the first length', () => {
    expect(kilometresAlongShannon(150_000, 360)).toBe(150);
  });

  it('is zero at the start', () => {
    expect(kilometresAlongShannon(0, 360)).toBe(0);
  });

  it('restarts from the source after each full length', () => {
    expect(kilometresAlongShannon(360_000, 360)).toBe(0);
    expect(kilometresAlongShannon(400_000, 360)).toBe(40);
    expect(kilometresAlongShannon(730_000, 360)).toBe(10);
  });

  it('defaults to the real length of the Shannon route', () => {
    expect(routeKm).toBeGreaterThan(300);
    expect(routeKm).toBeLessThan(420);
    expect(kilometresAlongShannon(routeKm * 1000 + 5_000)).toBeCloseTo(5, 6);
  });
});

describe('MyMap', () => {
  let fixture: ComponentFixture<MyMap>;
  let data: FakePmDataService;

  beforeEach(async () => {
    data = new FakePmDataService();
    // Google Maps isn't available in jsdom, so swap the map components for plain elements.
    TestBed.configureTestingModule({
      imports: [MyMap],
      providers: [{ provide: PmDataService, useValue: data }],
    }).overrideComponent(MyMap, {
      remove: { imports: [GoogleMap, MapPolyline, MapAdvancedMarker] },
      add: { schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });
    fixture = TestBed.createComponent(MyMap);
    await fixture.whenStable();
  });

  const near = (a: google.maps.LatLngLiteral, lng: number, lat: number) => {
    expect(a.lat).toBeCloseTo(lat, 4);
    expect(a.lng).toBeCloseTo(lng, 4);
  };

  it('draws the whole route as lat/lng points', () => {
    const path = fixture.componentInstance.path;
    expect(path.length).toBe(coords.length);
    expect(path[0]).toEqual({ lat: coords[0][1], lng: coords[0][0] });
  });

  it('puts the marker at the source with no distance rowed', () => {
    const [lng, lat] = coords[0];
    near(fixture.componentInstance.position(), lng, lat);
  });

  it('puts the marker at the mouth after one full length', () => {
    data.rowers.set([{ rower: 1, distance: routeKm * 1000 - 1 }]);
    const [lng, lat] = coords[coords.length - 1];
    near(fixture.componentInstance.position(), lng, lat);
  });

  it('moves the marker back to the source on the next length', () => {
    data.rowers.set([{ rower: 1, distance: routeKm * 1000 }]);
    const [lng, lat] = coords[0];
    near(fixture.componentInstance.position(), lng, lat);
  });

  it('moves the marker as the total grows', () => {
    const start = fixture.componentInstance.position();
    data.rowers.set([{ rower: 1, distance: 50_000 }]);
    expect(fixture.componentInstance.position()).not.toEqual(start);
  });
});
