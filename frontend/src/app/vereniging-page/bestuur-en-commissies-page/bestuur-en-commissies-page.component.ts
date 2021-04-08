import { Component, OnInit } from '@angular/core';
import { AppTitleService } from 'src/app/services/app-title.service';

@Component({
  selector: 'app-bestuur-en-commissies-page',
  templateUrl: './bestuur-en-commissies-page.component.html',
  styleUrls: ['./bestuur-en-commissies-page.component.scss']
})
export class BestuurEnCommissiesPageComponent implements OnInit {

  constructor(titleService: AppTitleService) {
    titleService.setTitle("Bestuur en commissies - Vereniging");
  }

  ngOnInit(): void {
  }

}
