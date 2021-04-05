import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-vertical-menu-item',
  templateUrl: './vertical-menu-item.component.html',
  styleUrls: ['./vertical-menu-item.component.scss']
})
export class VerticalMenuItemComponent {
  @Input("routerLink")
  routerLink!: string

  @Input("routerLinkActiveOptions")
  routerLinkActiveOptions!: {
    exact: boolean
  }

  constructor() {
    this.routerLinkActiveOptions = {
      exact: false
    };
  }
}
