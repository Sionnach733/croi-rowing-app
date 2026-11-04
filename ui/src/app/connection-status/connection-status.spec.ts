import { TestBed } from '@angular/core/testing';
import { PmDataService } from '../pm-data.service';
import { FakePmDataService } from '../testing';
import { ConnectionStatus } from './connection-status';

describe('ConnectionStatus', () => {
  it.each([
    ['connecting', 'Connecting…'],
    ['live', 'Live'],
    ['offline', 'Reconnecting · showing last totals'],
  ] as const)('shows %s', async (status, label) => {
    const data = new FakePmDataService();
    data.status.set(status);
    TestBed.configureTestingModule({
      imports: [ConnectionStatus],
      providers: [{ provide: PmDataService, useValue: data }],
    });
    const fixture = TestBed.createComponent(ConnectionStatus);
    await fixture.whenStable();
    const el = fixture.nativeElement.querySelector('[role=status]') as HTMLElement;
    expect(el.textContent?.trim()).toBe(label);
    expect(el.classList).toContain(`status--${status}`);
  });
});
