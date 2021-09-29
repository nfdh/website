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
export class IntlNumberService {
  private cache: {
    [k: string]: Intl.NumberFormat | undefined
  } = {};

  constructor() { }

  format(value: number, options: Intl.NumberFormatOptions) {
    const key = getCacheId([options]);
    let intlFormat = this.cache[key];
    if(!intlFormat) {
      intlFormat = new Intl.NumberFormat("nl-NL", options);
      this.cache[key] = intlFormat;
    }
    return intlFormat.format(value);
  }
}
