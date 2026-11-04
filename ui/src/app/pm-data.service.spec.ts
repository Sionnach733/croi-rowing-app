import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PmDataService } from './pm-data.service';

const URL = 'http://127.0.0.1:5000/rowers';

describe('PmDataService', () => {
  let service: PmDataService;
  let http: HttpTestingController;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PmDataService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    vi.useRealTimers();
  });

  it('starts empty with a zero total', () => {
    expect(service.rowers()).toEqual([]);
    expect(service.totalDistance()).toBe(0);
    vi.advanceTimersByTime(0);
    http.expectOne(URL).flush([]);
  });

  it('fetches immediately and totals all rowers', () => {
    vi.advanceTimersByTime(0);
    http.expectOne(URL).flush([
      { rower: 1, distance: 1000 },
      { rower: 2, distance: 2500 },
    ]);

    expect(service.rowers().length).toBe(2);
    expect(service.totalDistance()).toBe(3500);
  });

  it('polls again every 10 seconds', () => {
    vi.advanceTimersByTime(0);
    http.expectOne(URL).flush([{ rower: 1, distance: 100 }]);

    vi.advanceTimersByTime(9_999);
    http.expectNone(URL);

    vi.advanceTimersByTime(1);
    http.expectOne(URL).flush([{ rower: 1, distance: 200 }]);
    expect(service.totalDistance()).toBe(200);
  });

  it('keeps the last values and keeps polling after a failed request', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.advanceTimersByTime(0);
    http.expectOne(URL).flush([{ rower: 1, distance: 500 }]);

    vi.advanceTimersByTime(10_000);
    http.expectOne(URL).flush('down', { status: 500, statusText: 'Server Error' });
    expect(service.totalDistance()).toBe(500);
    expect(consoleError).toHaveBeenCalled();

    vi.advanceTimersByTime(10_000);
    http.expectOne(URL).flush([{ rower: 1, distance: 900 }]);
    expect(service.totalDistance()).toBe(900);
  });

  it('cancels an in-flight request when the next poll fires', () => {
    vi.advanceTimersByTime(0);
    const slow = http.expectOne(URL);

    vi.advanceTimersByTime(10_000);
    expect(slow.cancelled).toBe(true);
    http.expectOne(URL).flush([{ rower: 1, distance: 42 }]);
    expect(service.totalDistance()).toBe(42);
  });
});
