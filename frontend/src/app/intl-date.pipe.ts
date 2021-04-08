import { Pipe, PipeTransform } from '@angular/core';
import { IntlDateService } from './services/intl-date.service';

@Pipe({
  name: 'intlDate'
})
export class IntlDatePipe implements PipeTransform {
  constructor(private intlDateService: IntlDateService) { }

  transform(value: unknown, ...args: unknown[]): unknown {
    return this.intlDateService.intl.format(value as Date);
  }
}
