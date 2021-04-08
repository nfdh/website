import { TestBed } from '@angular/core/testing';

import { IntlDateService } from './intl-date.service';

describe('IntlDateService', () => {
  let service: IntlDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntlDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
