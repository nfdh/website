import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { map } from "rxjs/operators";

@Component({
  selector: 'app-member-page',
  templateUrl: './member-page.component.html',
  styleUrls: ['./member-page.component.scss']
})
export class MemberPageComponent implements OnInit {
  isWebsiteContributor$ = this.authenticationService.user$.pipe(map(u => u?.role_website_contributor));
  isMemberAdministrator$ = this.authenticationService.user$.pipe(map(u => u?.role_member_administrator));

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
  }

}
