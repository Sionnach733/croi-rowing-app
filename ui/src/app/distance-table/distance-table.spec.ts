import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyMap } from '../my-map/my-map';
import { PmDataService } from '../pm-data.service';
import { FakePmDataService, MyMapStub } from '../testing';
import { DistanceTable } from './distance-table';

describe('DistanceTable', () => {
  let fixture: ComponentFixture<DistanceTable>;
  let data: FakePmDataService;
  let el: HTMLElement;

  beforeEach(async () => {
    data = new FakePmDataService();
    TestBed.configureTestingModule({
      imports: [DistanceTable],
      providers: [{ provide: PmDataService, useValue: data }],
    }).overrideComponent(DistanceTable, {
      remove: { imports: [MyMap] },
      add: { imports: [MyMapStub] },
    });
    fixture = TestBed.createComponent(DistanceTable);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  async function setRowers(...distances: number[]) {
    data.rowers.set(distances.map((distance, i) => ({ rower: i + 1, distance })));
    await fixture.whenStable();
  }

  it('shows zero before any data arrives', () => {
    expect(el.querySelector('#totalMetres')?.textContent).toContain('0 / 1,000,000');
    expect(el.querySelectorAll('tr[mat-row]').length).toBe(0);
  });

  it('renders a row per rower with formatted distances', async () => {
    await setRowers(61000, 1234);
    const rows = Array.from(el.querySelectorAll('tr[mat-row]'));
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('1');
    expect(rows[0].textContent).toContain('61,000');
    expect(rows[1].textContent).toContain('1,234');
  });

  it('shows the formatted total', async () => {
    await setRowers(250_000, 5_500);
    expect(el.querySelector('#totalMetres')?.textContent).toContain('255,500 / 1,000,000');
  });

  it('rounds the percentage down', async () => {
    await setRowers(129_999);
    expect(fixture.componentInstance.percentage()).toBe(12);
    expect(el.querySelector('.percent')?.textContent).toContain('12%');
  });

  it('caps the percentage at 100 and shows the goal message', async () => {
    expect(el.querySelector('.goal')).toBeNull();
    await setRowers(900_000, 300_000);
    expect(fixture.componentInstance.percentage()).toBe(100);
    expect(el.querySelector('.goal')?.textContent).toContain('Goal Achieved!');
  });

  it('does not show the goal message just below the target', async () => {
    await setRowers(999_999);
    expect(fixture.componentInstance.percentage()).toBe(99);
    expect(el.querySelector('.goal')).toBeNull();
  });

  it('includes the map', () => {
    expect(el.querySelector('app-my-map')).not.toBeNull();
  });
});
