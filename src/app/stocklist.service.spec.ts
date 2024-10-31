import { TestBed } from '@angular/core/testing';

import { StocklistService } from './stocklist.service';

describe('StocklistService', () => {
  let service: StocklistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StocklistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
