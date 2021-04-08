import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class AppTitleService {

  constructor(private titleService: Title) {
  }

  setTitle(t: string) {
    this.titleService.setTitle(t + " - Nederlandse Fokkersvereniging Het Drentse Heideschaap");
  }
}
