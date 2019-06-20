import { TestBed } from '@angular/core/testing';

import { PmDataService } from './pm-data.service';

describe('PmDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PmDataService = TestBed.get(PmDataService);
    expect(service).toBeTruthy();
  });
});
