import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormSectionComponent } from './form-section/form-section.component';
import { FormActionsComponent } from './form-actions/form-actions.component';
import { MatDividerModule } from '@angular/material/divider';


@NgModule({
  declarations: [
    FormSectionComponent,
    FormActionsComponent
  ],
  imports: [
    CommonModule,
    MatDividerModule
  ],
  exports: [
    FormSectionComponent,
    FormActionsComponent
  ]
})
export class FormModule { }
