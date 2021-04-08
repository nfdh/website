import { Component, OnInit } from '@angular/core';
import { AppTitleService } from 'src/app/services/app-title.service';

@Component({
  selector: 'app-calamiteitenplan-page',
  templateUrl: './calamiteitenplan-page.component.html',
  styleUrls: ['./calamiteitenplan-page.component.scss']
})
export class CalamiteitenplanPageComponent implements OnInit {

  constructor(titleService: AppTitleService) {
    titleService.setTitle("Calamiteitenplan - Vereniging");
  }

  ngOnInit(): void {
  }

}
