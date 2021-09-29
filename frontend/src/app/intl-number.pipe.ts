import { Pipe, PipeTransform } from '@angular/core';
import { IntlNumberService } from './services/intl-number.service';

@Pipe({
  name: 'intlNumber'
})
export class IntlNumberPipe implements PipeTransform {
  constructor(private intlNumberService: IntlNumberService) {}

  transform(value: number, options: Intl.NumberFormatOptions): unknown {
    return this.intlNumberService.format(value, options);
  }
}
