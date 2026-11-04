import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { PmDataService } from './pm-data.service';
import { RouteMap } from './route-map/route-map';
import { FakePmDataService, RouteMapStub } from './testing';

describe('App', () => {
  it('lays out the header, map, progress and leaderboard', async () => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [{ provide: PmDataService, useValue: new FakePmDataService() }],
    }).overrideComponent(App, {
      remove: { imports: [RouteMap] },
      add: { imports: [RouteMapStub] },
    });
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('h1')?.textContent).toContain('1,000,000 Metre Rowathon');
    const logos = Array.from(el.querySelectorAll('img')).map((i) => i.getAttribute('alt'));
    expect(logos).toEqual(['CrossFit Croí', 'Pieta House']);
    for (const sel of ['app-connection-status', 'app-route-map', 'app-progress-panel', 'app-leaderboard']) {
      expect(el.querySelector(sel), sel).not.toBeNull();
    }
  });
});
