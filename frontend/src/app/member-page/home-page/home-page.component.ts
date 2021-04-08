import { Component, OnInit } from '@angular/core';
import { AppTitleService } from 'src/app/services/app-title.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(titleService: AppTitleService) {
    titleService.setTitle("Ledenportaal");
  }

  ngOnInit(): void {
  }

}
