import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { createFormGroup } from '../user-form/user-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppTitleService } from 'src/app/services/app-title.service';

interface AddResult {
  success: boolean,
  id?: number,
  reason?: "EMAIL_ALREADY_IN_USE" | "UNKNOWN"
}

@Component({
  selector: 'app-add-user-page',
  templateUrl: './add-user-page.component.html',
  styleUrls: ['./add-user-page.component.scss']
})
export class AddUserPageComponent {
  formGroup = createFormGroup()
  errorMessage: string | null = null;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private snackBar: MatSnackBar,
    titleService: AppTitleService
  ) { 

    titleService.setTitle("Gebruiker toevoegen - Ledenportaal");
  }

  onSubmit(ev: Event) {
    ev.preventDefault();

    if(!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.httpClient.post<AddResult>("/api/users", this.formGroup.value)
      .subscribe((result) => {
        if(result.success) {
          this.router.navigate([".."], { relativeTo: this.route });
          this.snackBar.open("Gebruiker is toegevoegd", "Openen", {
            duration: 5000
          })
            .onAction()
            .subscribe(() => {
              this.router.navigate(["..", result.id], { relativeTo: this.route })
            });
        }
        else if(result.reason === "EMAIL_ALREADY_IN_USE") {
          this.formGroup.controls.email.setErrors({
            notUnique: true
          });
        }
      }, (e) => {
        this.errorMessage = "Er is een fout opgetreden bij het toevoegen, probeer het later opnieuw.";
      });
  }
  
  onCancelClick() {
    this.router.navigate([".."], {
      relativeTo: this.route
    });
  }

}