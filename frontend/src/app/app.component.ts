import { Component, ComponentRef, ViewChild } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { map } from "rxjs/operators";
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isAuthenticated$ = this.authenticationService.user$.pipe(
    map(u => u != null)
  );
  isWebsiteContributor$ = this.authenticationService.user$.pipe(map(u => u?.role_website_contributor));
  isMemberAdministrator$ = this.authenticationService.user$.pipe(map(u => u?.role_member_administrator));
  isMemberOfStudbook$ = this.authenticationService.user$.pipe(map(u => u?.studbook_heideschaap || u?.studbook_schoonebeeker));

  loading: boolean;
  loadProgress: number;
  loadInterval: number | null;

  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(private authenticationService: AuthenticationService, private router: Router, private httpClient: HttpClient) {
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
    event.preventDefault();

    this.httpClient.post<any>("/api/logout", {})
      .subscribe(() => {
        this.authenticationService.notifyLogout();
        this.router.navigate([""]);
      });
  }
}
