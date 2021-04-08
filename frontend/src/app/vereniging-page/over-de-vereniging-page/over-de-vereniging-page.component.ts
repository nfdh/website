import { Component, OnInit } from '@angular/core';
import { AppTitleService } from 'src/app/services/app-title.service';

@Component({
  selector: 'app-over-de-vereniging-page',
  templateUrl: './over-de-vereniging-page.component.html',
  styleUrls: ['./over-de-vereniging-page.component.scss']
})
export class OverDeVerenigingPageComponent implements OnInit {

  constructor(titleService: AppTitleService) {
    titleService.setTitle("Over de vereniging - Vereniging");
  }

  ngOnInit(): void {
  }

}
