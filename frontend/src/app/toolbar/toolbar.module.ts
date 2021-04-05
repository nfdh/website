import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ToolbarSeparatorComponent } from './toolbar-separator/toolbar-separator.component';

@NgModule({
  declarations: [
    ToolbarComponent,
    ToolbarSeparatorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ToolbarComponent,
    ToolbarSeparatorComponent
  ]
})
export class ToolbarModule { }
