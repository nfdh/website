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
    { name: "november 2021", url: "/assets/newsletters/2021-11.pdf" },
    { name: "november 2022", url: "/assets/newsletters/2022-11.pdf" },
    { name: "september 2023", url: "/assets/newsletters/2023-09.pdf" },
    { name: "oktober 2023", url: "/assets/newsletters/2023-10.pdf" },
    { name: "februari 2024", url: "/assets/newsletters/2024-02.pdf" },
    { name: "september 2024", url: "/assets/newsletters/2024-09.pdf" },
    { name: "oktober 2024", url: "/assets/newsletters/2024-10.pdf" }
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

    this.embedded = embed(this.newsletters[this.currentIndex].url, this.embedContainer.nativeElement, {
      fallbackLink: "<a href='[url]' target='_blank'>Klik hier om de nieuwsbrief te openen</a>"
    });
  }

  get current(): string {
    return this.newsletters[this.currentIndex].name;
  }

  get previous(): string {
    if(this.currentIndex === 0) {
      return "";
    }
    return this.newsletters[this.currentIndex - 1].name;
  }

  get next(): string {
    if(this.currentIndex === this.newsletters.length - 1) {
      return "";
    }

    return this.newsletters[this.currentIndex + 1].name;
  }
}
