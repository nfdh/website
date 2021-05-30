import { Pipe, PipeTransform } from '@angular/core';
import { IntlDateTimeService } from './services/intl-date-time.service';

@Pipe({
  name: 'intlDateTime'
})
export class IntlDateTimePipe implements PipeTransform {
  constructor(private intlDateTimeService: IntlDateTimeService) {}

  transform(value: Date, options: Intl.DateTimeFormatOptions): unknown {
    return this.intlDateTimeService.format(value as Date, options);
  }
}
