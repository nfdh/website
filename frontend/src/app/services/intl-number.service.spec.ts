import { TestBed } from '@angular/core/testing';

import { IntlNumberService } from './intl-number.service';

describe('IntlNumberService', () => {
  let service: IntlNumberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntlNumberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
