import { TestBed } from '@angular/core/testing';

import { SensorStorageService } from './sensor-storage.service';

describe('SensorStorageService', () => {
  let service: SensorStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SensorStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
