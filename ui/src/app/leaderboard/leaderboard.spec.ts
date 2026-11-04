import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PmDataService } from '../pm-data.service';
import { FakePmDataService } from '../testing';
import { Leaderboard } from './leaderboard';

describe('Leaderboard', () => {
  let fixture: ComponentFixture<Leaderboard>;
  let data: FakePmDataService;
  let el: HTMLElement;

  beforeEach(async () => {
    data = new FakePmDataService();
    TestBed.configureTestingModule({
      imports: [Leaderboard],
      providers: [{ provide: PmDataService, useValue: data }],
    });
    fixture = TestBed.createComponent(Leaderboard);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  const rows = () => Array.from(el.querySelectorAll('.row'));

  it('shows a waiting message before any data', () => {
    expect(rows().length).toBe(0);
    expect(el.querySelector('.empty')?.textContent).toContain('Waiting');
  });

  it('names rowers by station and sorts furthest first', async () => {
    data.setDistances(1_000, 61_000, 30_500);
    await fixture.whenStable();

    expect(rows().map((r) => r.querySelector('.name')?.textContent)).toEqual([
      'Rower 2',
      'Rower 3',
      'Rower 1',
    ]);
    expect(rows()[0].querySelector('.distance')?.textContent).toContain('61,000 m');
    expect(rows().map((r) => r.querySelector('.rank')?.textContent)).toEqual(['1', '2', '3']);
  });

  it('highlights only the leader', async () => {
    data.setDistances(100, 200);
    await fixture.whenStable();
    expect(rows()[0].classList).toContain('row--leader');
    expect(rows()[1].classList).not.toContain('row--leader');
  });

  it('sizes bars relative to the leader', async () => {
    data.setDistances(500, 2_000);
    await fixture.whenStable();
    const widths = rows().map((r) => (r.querySelector('.track__fill') as HTMLElement).style.width);
    expect(widths).toEqual(['100%', '25%']);
  });

  it('handles everyone still on zero', async () => {
    data.setDistances(0, 0);
    await fixture.whenStable();
    expect(fixture.componentInstance.rows().map((r) => r.share)).toEqual([0, 0]);
  });

  it('does not use backend serial numbers as names', async () => {
    data.rowers.set([{ rower: 430391865, distance: 10 }]);
    await fixture.whenStable();
    expect(rows()[0].textContent).not.toContain('430391865');
  });
});
