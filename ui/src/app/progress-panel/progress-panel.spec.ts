import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PmDataService } from '../pm-data.service';
import { SHANNON_KM } from '../shannon-route';
import { FakePmDataService } from '../testing';
import { ProgressPanel } from './progress-panel';

describe('ProgressPanel', () => {
  let fixture: ComponentFixture<ProgressPanel>;
  let data: FakePmDataService;
  let el: HTMLElement;
  const text = (sel: string) => el.querySelector(sel)?.textContent?.replace(/\s+/g, ' ').trim();

  beforeEach(async () => {
    data = new FakePmDataService();
    TestBed.configureTestingModule({
      imports: [ProgressPanel],
      providers: [{ provide: PmDataService, useValue: data }],
    });
    fixture = TestBed.createComponent(ProgressPanel);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  async function row(...distances: number[]) {
    data.setDistances(...distances);
    await fixture.whenStable();
  }

  it('starts at zero', () => {
    expect(text('.total')).toBe('0m');
    expect(text('.target')).toBe('of 1,000,000 m');
    expect(el.querySelector('[role=progressbar]')?.getAttribute('aria-valuenow')).toBe('0');
  });

  it('shows the formatted team total', async () => {
    await row(250_000, 5_500);
    expect(text('.total')).toBe('255,500m');
  });

  it('shows percent complete rounded down to one decimal', async () => {
    await row(123_456);
    expect(fixture.componentInstance.percent()).toBe(12.3);
    expect(el.querySelector('.stats')?.textContent).toContain('12.3%');
  });

  it('fills the progress bar to match', async () => {
    await row(400_000);
    const bar = el.querySelector('[role=progressbar]')!;
    expect(bar.getAttribute('aria-valuenow')).toBe('40');
    expect((el.querySelector('.bar__fill') as HTMLElement).style.width).toBe('40%');
  });

  it('shows kilometres still to go', async () => {
    await row(999_000 - 250);
    expect(el.querySelector('.stats')?.textContent).toContain('1.3 km');
  });

  it('shows lengths of the Shannon rowed', async () => {
    await row(Math.round(SHANNON_KM * 1500));
    expect(el.querySelector('.stats')?.textContent).toContain('1.50×');
  });

  it('is not in the goal state just below target', async () => {
    await row(999_999);
    expect(fixture.componentInstance.goalReached()).toBe(false);
    expect(el.querySelector('.panel--goal')).toBeNull();
    expect(fixture.componentInstance.percent()).toBe(99.9);
  });

  it('celebrates when the target is reached', async () => {
    await row(1_000_000);
    expect(el.querySelector('.panel--goal')).not.toBeNull();
    expect(text('.eyebrow')).toBe('Goal reached!');
    expect(text('.stats')).toContain('0.0 km');
  });

  it('keeps counting past the target but caps the bar', async () => {
    await row(900_000, 300_000);
    expect(fixture.componentInstance.percent()).toBe(120);
    expect(el.querySelector('[role=progressbar]')?.getAttribute('aria-valuenow')).toBe('100');
  });
});
