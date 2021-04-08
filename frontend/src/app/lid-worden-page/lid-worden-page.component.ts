import { Component, OnInit } from '@angular/core';
import { AppTitleService } from '../services/app-title.service';

@Component({
  selector: 'app-lid-worden-page',
  templateUrl: './lid-worden-page.component.html',
  styleUrls: ['./lid-worden-page.component.scss']
})
export class LidWordenPageComponent implements OnInit {

  constructor(titleService: AppTitleService) {
    titleService.setTitle("Lid worden");
  }

  ngOnInit(): void {
  }

}
