import { Component, OnInit } from '@angular/core';
import { AppTitleService } from 'src/app/services/app-title.service';

@Component({
  selector: 'app-regelgeving-page',
  templateUrl: './regelgeving-page.component.html',
  styleUrls: ['./regelgeving-page.component.scss']
})
export class RegelgevingPageComponent implements OnInit {

  constructor(titleService: AppTitleService) {
    titleService.setTitle("Regelgeving - Fokken");
  }

  ngOnInit(): void {
  }

}
