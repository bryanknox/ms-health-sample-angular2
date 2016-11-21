/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MsHealthService } from './ms-health.service';

describe('Service: MsHealth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MsHealthService]
    });
  });

  it('should ...', inject([MsHealthService], (service: MsHealthService) => {
    expect(service).toBeTruthy();
  }));
});
