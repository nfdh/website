import { Component, OnInit } from '@angular/core';
import { AppTitleService } from '../services/app-title.service';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent {

  constructor(titleService: AppTitleService) {
    titleService.setTitle("Contact");
   }
}
