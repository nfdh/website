import { Component, ComponentRef, ViewChild } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { map } from "rxjs/operators";
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isAuthenticated$ = this.authenticationService.user$.pipe(
    map(u => u != null)
  );
  loading: boolean;
  loadProgress: number;
  loadInterval: number | null;

  isWebsiteContributor$ = this.authenticationService.user$
    .pipe(
      map(u => u?.role_website_contributor)
    );

  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(private authenticationService: AuthenticationService, private router: Router) {
    this.loading = false;
    this.loadProgress = 0;
    this.loadInterval = null;

    this.router.events.subscribe((event: Event) => {
      if(event instanceof NavigationStart) {
        this.loading = true;
        this.loadProgress = 30;
        this.loadInterval = window.setInterval(() => {
          this.loadProgress += 10;
          if(this.loadProgress === 80) {
            window.clearInterval(this.loadInterval!);
            this.loadInterval = null;
          }
        }, 1000);
      }

      if(event instanceof NavigationEnd
        || event instanceof NavigationCancel
        || event instanceof NavigationError) {
          
        this.sidenav.close();
        this.loading = false;
        if(this.loadInterval) {
          window.clearInterval(this.loadInterval!);
          this.loadInterval = null;
        }
      }
    });
  }

  logout(event: MouseEvent) {
    this.authenticationService.notifyLogout();
    this.router.navigate([""])

    event.preventDefault();
  }
}
