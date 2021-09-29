import { TestBed } from '@angular/core/testing';

import { IntlDateAdapterService } from './intl-date-adapter.service';

describe('IntlDateAdapterService', () => {
  let service: IntlDateAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntlDateAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
