import { Component, OnInit } from '@angular/core';
import { AppTitleService } from 'src/app/services/app-title.service';

@Component({
  selector: 'app-wormbestrijding-page',
  templateUrl: './wormbestrijding-page.component.html',
  styleUrls: ['./wormbestrijding-page.component.scss']
})
export class WormbestrijdingPageComponent implements OnInit {

  constructor(titleService: AppTitleService) {
    titleService.setTitle("Wormbestrijding - Fokken");
  }

  ngOnInit(): void {
  }

}
