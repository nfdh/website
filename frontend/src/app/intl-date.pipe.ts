import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'intlDate'
})
export class IntlDatePipe implements PipeTransform {
  intl: Intl.DateTimeFormat;

  constructor() {
    this.intl = new Intl.DateTimeFormat("nl", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour12: false
    });

    console.log("pipe created");
  }

  transform(value: unknown, ...args: unknown[]): unknown {
    return this.intl.format(value as Date);
  }
}
