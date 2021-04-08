import { Component, OnInit } from '@angular/core';
import { AppTitleService } from 'src/app/services/app-title.service';

@Component({
  selector: 'app-drents-heideschaap-historie',
  templateUrl: './drents-heideschaap-historie.component.html',
  styleUrls: ['./drents-heideschaap-historie.component.scss']
})
export class DrentsHeideschaapHistorieComponent implements OnInit {

  constructor(titleService: AppTitleService) {
    titleService.setTitle("Historie Drents Heideschaap - Fokken");
  }

  ngOnInit(): void {
  }

}
