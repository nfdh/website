import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IntlDateService {
  public readonly intl: Intl.DateTimeFormat;

  constructor() { 
    this.intl = new Intl.DateTimeFormat("nl", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour12: false
    });
  }
}
