import { Injectable } from '@angular/core';


function getCacheId(inputs: any[]) {
  return JSON.stringify(
    inputs.map(input =>
      input && typeof input === 'object' ? orderedProps(input) : input
    )
  );
}

function orderedProps(obj: any) {
  return Object.keys(obj)
    .sort()
    .map(k => ({ [k]: obj[k] }));
}

@Injectable({
  providedIn: 'root'
})
export class IntlDateTimeService {
  private cache: {
    [k: string]: Intl.DateTimeFormat | undefined
  } = {};

  constructor() { }

  format(date: Date, options: Intl.DateTimeFormatOptions) {
    const key = getCacheId([options]);
    let intlFormat = this.cache[key];
    if(!intlFormat) {
      intlFormat = new Intl.DateTimeFormat("nl-NL", options);
      this.cache[key] = intlFormat;
    }
    return intlFormat.format(date);
  }
}
