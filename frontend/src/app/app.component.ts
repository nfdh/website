import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { map } from "rxjs/operators";
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isAuthenticated$ = this.authenticationService.user$.pipe(
    map(u => u != null)
  );

  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  logout(event: MouseEvent) {
    this.authenticationService.notifyLogout();
    this.router.navigate([""])

    event.preventDefault();
  }
}
