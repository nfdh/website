import { Component, OnInit } from '@angular/core';
import { AppTitleService } from 'src/app/services/app-title.service';

@Component({
  selector: 'app-schoonebeeker-historie',
  templateUrl: './schoonebeeker-historie.component.html',
  styleUrls: ['./schoonebeeker-historie.component.scss']
})
export class SchoonebeekerHistorieComponent implements OnInit {

  constructor(titleService: AppTitleService) {
    titleService.setTitle("Historie Schoonebeeker - Fokken");
  }

  ngOnInit(): void {
  }

}
