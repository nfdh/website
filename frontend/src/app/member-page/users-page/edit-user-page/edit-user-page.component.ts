import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { createFormGroup } from '../user-form/user-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AppTitleService } from 'src/app/services/app-title.service';

interface UpdateResult {
  success: boolean,
  reason?: "EMAIL_ALREADY_IN_USE" | "UNKNOWN"
}

interface GetUserResult {
  success: boolean,
  user?: any,
  reason?: "USER_NOT_FOUND"
}

@Component({
  selector: 'app-edit-user-page',
  templateUrl: './edit-user-page.component.html',
  styleUrls: ['./edit-user-page.component.scss']
})
export class EditUserPageComponent implements OnDestroy {
  id: number = 0;
  loading: boolean = true;
  formGroup = createFormGroup();
  loadErrorMessage: string | null = null;
  errorMessage: string | null = null;

  private routeSubscription: Subscription;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    titleService: AppTitleService
  ) { 
    titleService.setTitle("Gebruiker - Ledenportaal");

    this.routeSubscription = this.activatedRoute.params
      .subscribe((p) => {
        this.loading = true;
        this.formGroup.disable();
        this.loadErrorMessage = null;

        this.id = p.id;
        this.httpClient.get<GetUserResult>("/api/users/" + p.id)
          .subscribe((u) => {
            this.loading = false;
            if(u.success) {
              titleService.setTitle("Gebruiker " + u.user.name + " - Ledenportaal");

              this.formGroup.setValue(u.user);
              this.formGroup.enable();
            }
            else {
              switch(u.reason) {
                case "USER_NOT_FOUND":
                  this.loadErrorMessage = "De opgegeven gebruiker bestaat niet.";
                  break;
              }
            }
          }, (e) => {
            this.loadErrorMessage = "De gebruiker kon niet worden opgehaald.";
            this.loading = false;
          });
      });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  onSubmit(ev: Event) {
    ev.preventDefault();

    if(!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.httpClient.patch<UpdateResult>("/api/users/" + this.id, this.formGroup.value)
      .subscribe((result) => {
        if(result.success) {
          this.router.navigate([".."], { relativeTo: this.route });
          this.snackBar.open("Gebruiker is bijgewerkt", undefined, {
            duration: 5000
          });
        }
        else if(result.reason === "EMAIL_ALREADY_IN_USE") {
          this.formGroup.controls.email.setErrors({
            notUnique: true
          });
        }
      }, (e) => {
        this.errorMessage = "Er is een fout opgetreden bij het bijwerken, probeer het later opnieuw.";
      });
  }
  
  onCancelClick() {
    this.router.navigate([".."], {
      relativeTo: this.route
    });
  }
}
