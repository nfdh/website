import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { createFormGroup } from '../dekverklaring-form/dekverklaring-form.component';

interface AddResult {
  success: boolean,
  id?: number,
  reason?: "UNKNOWN"
}

@Component({
  selector: 'app-add-dekverklaring-page',
  templateUrl: './add-dekverklaring-page.component.html',
  styleUrls: ['./add-dekverklaring-page.component.scss']
})
export class AddDekverklaringPageComponent {
  formGroup = createFormGroup()

  errorMessage = '';

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private httpClient: HttpClient, 
    private snackBar: MatSnackBar
  ) { }

  onSubmit(ev: Event) {
    ev.preventDefault();

    if(!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.httpClient.post<AddResult>("/api/dekverklaringen", this.formGroup.value)
      .subscribe((result) => {
        if(result.success) {
          this.router.navigate([".."], { relativeTo: this.route });
          this.snackBar.open("Dekverklaring is verzonden", "Openen", {
            duration: 5000
          })
            .onAction()
            .subscribe(() => {
              this.router.navigate(["..", result.id], { relativeTo: this.route })
            });
        }
        else {
          this.errorMessage = "Er is een fout opgetreden bij het versturen, probeer het later opnieuw.";
        }
      }, (e) => {
        this.errorMessage = "Er is een fout opgetreden bij het versturen, probeer het later opnieuw.";
      });
  }

  onCancelClick() {
    this.router.navigate([".."], {
      relativeTo: this.route
    });
  }


}
