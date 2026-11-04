import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoogleMap, MapAdvancedMarker, MapPolyline } from '@angular/google-maps';
import { PmDataService } from '../pm-data.service';
import { pathRowed, pointAlongShannon, SHANNON_KM, SHANNON_PATH } from '../shannon-route';
import { FakePmDataService } from '../testing';
import { RouteMap } from './route-map';

describe('RouteMap', () => {
  let fixture: ComponentFixture<RouteMap>;
  let map: RouteMap;
  let data: FakePmDataService;

  beforeEach(async () => {
    data = new FakePmDataService();
    // Google Maps isn't available in jsdom, so swap the map components for plain elements.
    TestBed.configureTestingModule({
      imports: [RouteMap],
      providers: [{ provide: PmDataService, useValue: data }],
    }).overrideComponent(RouteMap, {
      remove: { imports: [GoogleMap, MapPolyline, MapAdvancedMarker] },
      add: { schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });
    fixture = TestBed.createComponent(RouteMap);
    map = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('draws the whole river', () => {
    expect(map.fullPath).toBe(SHANNON_PATH);
  });

  it('starts at the source with nothing rowed', () => {
    expect(map.position()).toEqual(pointAlongShannon(0));
    expect(map.rowedPath()).toEqual([SHANNON_PATH[0]]);
  });

  it('follows the team total along the river', () => {
    data.setDistances(60_000, 40_000);
    expect(map.position()).toEqual(pointAlongShannon(100));
    expect(map.rowedPath()).toEqual(pathRowed(100));
  });

  it('wraps back to the source on the next length', () => {
    data.setDistances(SHANNON_KM * 1000 + 10_000);
    expect(map.position()).toEqual(pointAlongShannon(10));
  });

  it('uses a custom marker element', () => {
    expect(map.markerContent.className).toBe('boat-marker');
  });

  it('shows a legend', () => {
    expect(fixture.nativeElement.querySelector('.legend')?.textContent).toContain('Still to go');
  });
});
