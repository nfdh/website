import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { embed } from 'pdfobject';
import { Subscription } from 'rxjs';

interface Signup {
  membershipType: number
}

interface GetResult {
  success: boolean,
  signup?: Signup
}

@Component({
  selector: 'app-view-signup-page',
  templateUrl: './view-signup-page.component.html',
  styleUrls: ['./view-signup-page.component.scss']
})
export class ViewSignupPageComponent implements AfterViewInit, OnDestroy {
  private routeSubscription?: Subscription;
  @ViewChild("embedContainer") embedContainer!: ElementRef<HTMLDivElement>;
  private embedded?: HTMLElement;
  public hasSheepList: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient
  ) { 
    this.routeSubscription = this.activatedRoute.params
      .subscribe((p) => {
        this.hasSheepList = false;

        this.httpClient.get<GetResult>("/api/signups/" + p.id)
          .subscribe(r => {
            if (r.success) this.hasSheepList = r.signup!.membershipType == 2;
          });
      });
  }
  
  ngAfterViewInit() {
    this.routeSubscription = this.activatedRoute.params
      .subscribe((p) => {
        if(this.embedded) {
          this.embedded.remove();
        }

        this.embedded = embed('/api/signups/' + p.id + '/form', this.embedContainer.nativeElement);
      });
  }

  ngOnDestroy() {
    this.routeSubscription!.unsubscribe();
  }
  
  downloadSheepList() {
    const id = this.activatedRoute.snapshot.params.id;

    var element = document.createElement('a');
    element.setAttribute('href', '/api/signups/' + id + "/sheeplist?download");
    element.setAttribute('download', "");
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

  onCancelClick() {
    this.router.navigate([".."], {
      relativeTo: this.activatedRoute
    });
  }
}
