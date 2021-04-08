import { Component, OnInit } from '@angular/core';
import { AppTitleService } from 'src/app/services/app-title.service';

@Component({
  selector: 'app-dracht-en-geboorte-page',
  templateUrl: './dracht-en-geboorte-page.component.html',
  styleUrls: ['./dracht-en-geboorte-page.component.scss']
})
export class DrachtEnGeboortePageComponent implements OnInit {

  constructor(titleService: AppTitleService) {
    titleService.setTitle("Dracht en geboorte - Fokken");
  }

  ngOnInit(): void {
  }

}
