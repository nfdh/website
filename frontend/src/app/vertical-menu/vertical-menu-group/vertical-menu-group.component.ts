import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-vertical-menu-group',
  templateUrl: './vertical-menu-group.component.html',
  styleUrls: ['./vertical-menu-group.component.scss']
})
export class VerticalMenuGroupComponent {
  @Input() title!: string;

  constructor() { }
}
