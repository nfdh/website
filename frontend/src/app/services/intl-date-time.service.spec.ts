import { TestBed } from '@angular/core/testing';

import { IntlDateTimeService } from './intl-date-time.service';

describe('IntlDateTimeService', () => {
  let service: IntlDateTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntlDateTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
