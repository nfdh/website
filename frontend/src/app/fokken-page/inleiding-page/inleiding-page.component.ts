import { Component, OnInit } from '@angular/core';
import { AppTitleService } from 'src/app/services/app-title.service';

@Component({
  selector: 'app-inleiding-page',
  templateUrl: './inleiding-page.component.html',
  styleUrls: ['./inleiding-page.component.scss']
})
export class InleidingPageComponent implements OnInit {

  constructor(titleService: AppTitleService) {
    titleService.setTitle("Inleiding - Fokken");
  }

  ngOnInit(): void {
  }

}
