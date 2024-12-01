import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { NavigationEnd, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { filter, map, startWith } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss']
})
export class MobileMenuComponent {

  isAuthenticated$ = this.authenticationService.user$.pipe(
    map(u => u != null)
  );
  isWebsiteContributor$ = this.authenticationService.user$.pipe(map(u => u?.role_website_contributor));
  isMemberAdministrator$ = this.authenticationService.user$.pipe(map(u => u?.role_member_administrator));
  isMemberOfStudbook$ = this.authenticationService.user$.pipe(map(u => u?.studbook_heideschaap || u?.studbook_schoonebeeker));

  inLedenportaalRoute$ = this.router.events.pipe(
    filter(e => e instanceof NavigationEnd),
    map(e => (e as NavigationEnd).url),
    startWith(this.router.url),
    map(e => e.startsWith("/ledenportaal"))
  )

  @Input() sidenav!: MatSidenav;

  @Input() logout!: (event: MouseEvent) => void;

  constructor(private authenticationService: AuthenticationService, private router: Router, private httpClient: HttpClient) {

  }

}
