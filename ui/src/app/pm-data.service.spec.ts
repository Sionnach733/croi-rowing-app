import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PmDataService } from './pm-data.service';

describe('PmDataService', () => {
  it('polls the backend and totals all rowers', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const service = TestBed.inject(PmDataService);
    const http = TestBed.inject(HttpTestingController);

    expect(service.totalDistance()).toBe(0);
    await new Promise((r) => setTimeout(r)); // let timer(0) fire

    http.expectOne('http://127.0.0.1:5000/rowers').flush([
      { rower: 1, distance: 1000 },
      { rower: 2, distance: 2500 },
    ]);

    expect(service.rowers().length).toBe(2);
    expect(service.totalDistance()).toBe(3500);
  });
});
