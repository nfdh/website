import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { createFormGroup } from '../huiskeuring-form/huiskeuring-form.component';
import { FormArray, FormGroup } from '@angular/forms';

interface UpdateResult {
  success: boolean,
  reason?: "UNKNOWN"
}

interface GetResult {
  success: boolean,
  huiskeuring?: any,
  reason?: "HUISKEURING_NOT_FOUND"
}

@Component({
  selector: 'app-edit-huiskeuring-page',
  templateUrl: './edit-huiskeuring-page.component.html',
  styleUrls: ['./edit-huiskeuring-page.component.scss']
})
export class EditHuiskeuringPageComponent {
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
    private activatedRoute: ActivatedRoute
  ) { 
    this.routeSubscription = this.activatedRoute.params
      .subscribe((p) => {
        this.loading = true;
        this.formGroup.disable();
        this.loadErrorMessage = null;

        this.id = p.id;
        this.httpClient.get<GetResult>("/api/huiskeuringen/" + p.id)
          .subscribe((u) => {
            this.loading = false;
            if(u.success) {
              this.formGroup.setValue(u.huiskeuring);
              this.formGroup.controls.preferred_date.setValue(u.huiskeuring.preferred_date); // Reset preferred date
              this.formGroup.enable();
            }
            else {
              switch(u.reason) {
                case "HUISKEURING_NOT_FOUND":
                  this.loadErrorMessage = "De opgegeven huiskeuring inschrijving bestaat niet.";
                  break;
              }
            }
          }, (e) => {
            this.loadErrorMessage = "De huiskeuring inschrijving kon niet worden opgehaald.";
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

    this.httpClient.patch<UpdateResult>("/api/huiskeuringen/" + this.id, this.formGroup.value)
      .subscribe((result) => {
        if(result.success) {
          this.router.navigate([".."], { relativeTo: this.route });
          this.snackBar.open("Huiskeuring is bijgewerkt", undefined, {
            duration: 5000
          });
        }
        else {
          this.errorMessage = "Er is een fout opgetreden bij het versturen van de correctie, probeer het later opnieuw.";
        }
      }, (e) => {
        this.errorMessage = "Er is een fout opgetreden bij het versturen van de correctie, probeer het later opnieuw.";
      });
  }
  
  onCancelClick() {
    this.router.navigate([".."], {
      relativeTo: this.route
    });
  }
}
