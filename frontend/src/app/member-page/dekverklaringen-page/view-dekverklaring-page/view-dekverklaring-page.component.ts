import { AfterViewInit, Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppTitleService } from 'src/app/services/app-title.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { embed } from "pdfobject";

@Component({
  selector: 'app-view-dekverklaring-page',
  templateUrl: './view-dekverklaring-page.component.html',
  styleUrls: ['./view-dekverklaring-page.component.scss']
})
export class ViewDekverklaringPageComponent implements AfterViewInit, OnDestroy {
  private routeSubscription?: Subscription;
  @ViewChild("embedContainer") embedContainer!: ElementRef<HTMLDivElement>;
  private embedded?: HTMLElement;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    titleService: AppTitleService
  ) { 
    titleService.setTitle("Dekverklaring - Ledenportaal");
  }

  ngAfterViewInit() {
    this.routeSubscription = this.activatedRoute.params
      .subscribe((p) => {
        if(this.embedded) {
          this.embedded.remove();
        }

        this.embedded = embed('/api/dekverklaringen/' + p.id, this.embedContainer.nativeElement);
      });
  }

  ngOnDestroy() {
    this.routeSubscription!.unsubscribe();
  }
  
  onCancelClick() {
    this.router.navigate([".."], {
      relativeTo: this.route
    });
  }
}
