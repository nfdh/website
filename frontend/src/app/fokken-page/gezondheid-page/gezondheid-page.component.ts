import { Component, OnInit } from '@angular/core';
import { AppTitleService } from 'src/app/services/app-title.service';

@Component({
  selector: 'app-gezondheid-page',
  templateUrl: './gezondheid-page.component.html',
  styleUrls: ['./gezondheid-page.component.scss']
})
export class GezondheidPageComponent implements OnInit {

  constructor(titleService: AppTitleService) {
    titleService.setTitle("Gezondheid - Fokken");
  }

  ngOnInit(): void {
  }

}
