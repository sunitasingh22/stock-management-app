import { TestBed } from '@angular/core/testing';

import { LivepriceService } from './liveprice.service';

describe('LivepriceService', () => {
  let service: LivepriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LivepriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
