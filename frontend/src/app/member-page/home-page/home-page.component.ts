import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { AppTitleService } from 'src/app/services/app-title.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { embed } from "pdfobject";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements AfterViewInit {
  newsletters = [
    { name: "#1 - 26 november 2021", url: "/assets/nieuwsbrief-26-november.pdf" }
  ];
  currentIndex = this.newsletters.length - 1;

  @ViewChild("embedContainer") embedContainer!: ElementRef<HTMLDivElement>;
  private embedded?: HTMLElement;

  constructor(titleService: AppTitleService) {
    titleService.setTitle("Ledenportaal");
  }

  ngAfterViewInit(): void {
    this.updateEmbed();
  }

  get canGoPrevious(): boolean {
    return this.currentIndex > 0;
  }

  get canGoNext(): boolean {
    return this.currentIndex < this.newsletters.length - 1;
  }

  onNextClick() {
    if(this.canGoNext) {
      this.currentIndex++;
    }

    this.updateEmbed();
  }

  onPreviousClick() {
    if(this.canGoPrevious) {
      this.currentIndex--;
    }

    this.updateEmbed();
  }

  private updateEmbed() {
    if(this.embedded) {
      this.embedded.remove();
    }

    this.embedded = embed(this.newsletters[this.currentIndex].url, this.embedContainer.nativeElement);
  }

  get current(): string {
    return this.newsletters[this.currentIndex].name;
  }

  get previous(): string {
    return "Oktober 2021";
  }

  get next(): string {
    return "December 2021";
  }
}
