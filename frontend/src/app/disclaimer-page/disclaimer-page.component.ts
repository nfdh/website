import { Component, OnInit } from '@angular/core';
import { AppTitleService } from '../services/app-title.service';

@Component({
  selector: 'app-disclaimer-page',
  templateUrl: './disclaimer-page.component.html',
  styleUrls: ['./disclaimer-page.component.scss']
})
export class DisclaimerPageComponent implements OnInit {

  constructor(titleService: AppTitleService) {
    titleService.setTitle("Disclaimer");
  }

  ngOnInit(): void {
  }

}
