import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { createDekgroepFormGroup, createFormGroup, createRamFormControl } from '../dekverklaring-form/dekverklaring-form.component';
import { FormArray, FormGroup } from '@angular/forms';

interface UpdateResult {
  success: boolean,
  reason?: "UNKNOWN"
}

interface GetResult {
  success: boolean,
  dekverklaring?: any,
  reason?: "DEKVERKLARING_NOT_FOUND"
}

@Component({
  selector: 'app-edit-dekverklaring-page',
  templateUrl: './edit-dekverklaring-page.component.html',
  styleUrls: ['./edit-dekverklaring-page.component.scss']
})
export class EditDekverklaringPageComponent {
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
        this.httpClient.get<GetResult>("/api/dekverklaringen/" + p.id)
          .subscribe((u) => {
            this.loading = false;
            if(u.success) {
              u.dekverklaring.studbook = u.dekverklaring.studbook.toString();

              const dekgroepFormGroups = this.formGroup.controls.dekgroepen as FormArray;
              while(dekgroepFormGroups.length > u.dekverklaring.dekgroepen.length) {
                dekgroepFormGroups.removeAt(dekgroepFormGroups.length - 1);
              }
              while(dekgroepFormGroups.length < u.dekverklaring.dekgroepen.length) {
                dekgroepFormGroups.push(createDekgroepFormGroup());
              }
              for(let i = 0; i < dekgroepFormGroups.length; i++) {
                const rammen = (dekgroepFormGroups.controls[i] as FormGroup).controls.rammen as FormArray;
                const targetRammen = u.dekverklaring.dekgroepen[i].rammen;
                while(rammen.length > targetRammen.length) {
                  rammen.removeAt(rammen.length - 1);
                }
                while(rammen.length < targetRammen.length) {
                  rammen.push(createRamFormControl());
                }
              }

              this.formGroup.setValue(u.dekverklaring);
              this.formGroup.enable();
            }
            else {
              switch(u.reason) {
                case "DEKVERKLARING_NOT_FOUND":
                  this.loadErrorMessage = "De opgegeven dekverklaring bestaat niet.";
                  break;
              }
            }
          }, (e) => {
            this.loadErrorMessage = "De dekverklaring kon niet worden opgehaald.";
            this.loading = false;
          });
      });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  studbookName(id: string) {
    switch(id) {
      case "0": return "Drents Heideschaap";
      case "1": return "Schoonebeeker";
    }
    return "";
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
