import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { VerticalMenuComponent } from './vertical-menu/vertical-menu.component';
import { VerticalMenuGroupComponent } from './vertical-menu-group/vertical-menu-group.component';
import { VerticalMenuItemComponent } from './vertical-menu-item/vertical-menu-item.component';

@NgModule({
  declarations: [
    VerticalMenuComponent,
    VerticalMenuGroupComponent,
    VerticalMenuItemComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    VerticalMenuComponent,
    VerticalMenuGroupComponent,
    VerticalMenuItemComponent
  ]
})
export class VerticalMenuModule { }
