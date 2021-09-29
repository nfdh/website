import { Platform } from '@angular/cdk/platform';
import { Injectable } from '@angular/core';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { IntlDateTimeService } from './intl-date-time.service';

/** Creates an array and fills it with values. */
function range<T>(length: number, valueFunction: (index: number) => T): T[] {
  const valuesArray = Array(length);
  for (let i = 0; i < length; i++) {
    valuesArray[i] = valueFunction(i);
  }
  return valuesArray;
}

@Injectable({
  providedIn: 'root'
})
export class IntlDateAdapterService extends NativeDateAdapter {

  constructor(platform: Platform, private intlDateTimeService: IntlDateTimeService) {
    super("", platform);
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    const dtf: Intl.DateTimeFormatOptions = { month: style, timeZone: 'utc' };
    return range(12, i =>
        this._stripDirectionalityCharacters2(this._format2(dtf, new Date(2017, i, 1))));
  }

  getDateNames(): string[] {
    const dtf: Intl.DateTimeFormatOptions = {day: 'numeric', timeZone: 'utc'};
    return range(31, i => this._stripDirectionalityCharacters2(
        this._format2(dtf, new Date(2017, 0, i + 1))));
  }
  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    const dtf: Intl.DateTimeFormatOptions = {weekday: style, timeZone: 'utc'};
    return range(7, i => this._stripDirectionalityCharacters2(
        this._format2(dtf, new Date(2017, 0, i + 1))));
  }
  getYearName(date: Date): string {
    const dtf: Intl.DateTimeFormatOptions = { year: 'numeric', timeZone: 'utc' };
    return this._stripDirectionalityCharacters2(this._format2(dtf, date));
  }
  getFirstDayOfWeek(): number {
    // Monday
    return 1;
  }
  parse(value: any): Date | null {
    const parts = value.split(/[-\/]/gi);
    const first = parseInt(parts[0], 10);
    if(parts.length !== 3 || isNaN(first)) {
      return null;
    }

    let year, month, day;
    if(first > 1000) {
      year = first;
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);

      if(isNaN(month) || isNaN(day)) {
        return null;
      }
    }
    else {
      day = first;
      month = parseInt(parts[1], 10);
      year = parseInt(parts[2], 10);

      if(isNaN(month) || isNaN(year)) {
        return null;
      }
    }

    const local = this.createDate(year, month - 1, day);
    const utc = new Date();
    utc.setUTCFullYear(local.getFullYear(), local.getMonth(), local.getDate());
    utc.setUTCHours(local.getHours(), local.getMinutes(), local.getSeconds(), local.getMilliseconds());
    return utc;
  }
  format(date: Date, displayFormat: Object): string {
      // On IE and Edge the i18n API will throw a hard error that can crash the entire app
      // if we attempt to format a date whose year is less than 1 or greater than 9999.
      if ((date.getFullYear() < 1 || date.getFullYear() > 9999)) {
        date = this.clone(date);
        date.setFullYear(Math.max(1, Math.min(9999, date.getFullYear())));
      }

      displayFormat = {...displayFormat, timeZone: 'utc'};
      return this._stripDirectionalityCharacters2(this._format2(displayFormat, date));
  }

  private _stripDirectionalityCharacters2(str: string) {
    return str.replace(/[\u200e\u200f]/g, '');
  }

  /**
   * When converting Date object to string, javascript built-in functions may return wrong
   * results because it applies its internal DST rules. The DST rules around the world change
   * very frequently, and the current valid rule is not always valid in previous years though.
   * We work around this problem building a new Date object which has its internal UTC
   * representation with the local date and time.
   * @param dtf Intl.DateTimeFormat object, containg the desired string format. It must have
   *    timeZone set to 'utc' to work fine.
   * @param date Date from which we want to get the string representation according to dtf
   * @returns A Date object with its UTC representation based on the passed in date info
   */
  private _format2(dtf: Intl.DateTimeFormatOptions, date: Date) {
    // Passing the year to the constructor causes year numbers <100 to be converted to 19xx.
    // To work around this we use `setUTCFullYear` and `setUTCHours` instead.
    const d = new Date();
    d.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    d.setUTCHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    return this.intlDateTimeService.format(d, dtf);
  }
}
