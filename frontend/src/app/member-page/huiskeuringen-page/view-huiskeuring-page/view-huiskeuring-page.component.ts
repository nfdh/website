import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { embed } from 'pdfobject';

@Component({
  selector: 'app-view-huiskeuring-page',
  templateUrl: './view-huiskeuring-page.component.html',
  styleUrls: ['./view-huiskeuring-page.component.scss']
})
export class ViewHuiskeuringPageComponent implements AfterViewInit, OnDestroy {
  private routeSubscription?: Subscription;
  @ViewChild("embedContainer") embedContainer!: ElementRef<HTMLDivElement>;
  private embedded?: HTMLElement;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute
  ) { }
  
  ngAfterViewInit() {
    this.routeSubscription = this.activatedRoute.params
      .subscribe((p) => {
        if(this.embedded) {
          this.embedded.remove();
        }

        this.embedded = embed('/api/huiskeuringen/' + p.id, this.embedContainer.nativeElement);
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
