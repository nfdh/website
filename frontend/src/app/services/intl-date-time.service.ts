import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IntlDateTimeService {
  public readonly intl: Intl.DateTimeFormat;

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
}
