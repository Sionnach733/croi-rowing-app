import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { DistanceTable } from './distance-table/distance-table';
import { DistanceTableStub } from './testing';

describe('App', () => {
  it('renders the header, logos and distance table', async () => {
    TestBed.configureTestingModule({ imports: [App] }).overrideComponent(App, {
      remove: { imports: [DistanceTable] },
      add: { imports: [DistanceTableStub] },
    });
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('h1')?.textContent).toContain('1,000,000 Metre Rowathon');
    const logos = Array.from(el.querySelectorAll('img')).map((i) => i.getAttribute('alt'));
    expect(logos).toEqual(['CrossFit Croi', 'Pieta House']);
    expect(el.querySelector('app-distance-table')).not.toBeNull();
  });
});
