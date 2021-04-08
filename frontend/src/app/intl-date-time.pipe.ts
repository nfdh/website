import { Pipe, PipeTransform } from '@angular/core';
import { IntlDateTimeService } from './services/intl-date-time.service';

@Pipe({
  name: 'intlDateTime'
})
export class IntlDateTimePipe implements PipeTransform {
  constructor(private intlDateTimeService: IntlDateTimeService) {}

  transform(value: unknown, ...args: unknown[]): unknown {
    return this.intlDateTimeService.intl.format(value as Date);
  }
}
