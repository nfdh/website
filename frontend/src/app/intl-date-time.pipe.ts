import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'intlDateTime'
})
export class IntlDateTimePipe implements PipeTransform {
  intl: Intl.DateTimeFormat;

  constructor() {
    this.intl = new Intl.DateTimeFormat("nl", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false
    });
  }

  transform(value: unknown, ...args: unknown[]): unknown {
    return this.intl.format(value as Date);
  }
}
