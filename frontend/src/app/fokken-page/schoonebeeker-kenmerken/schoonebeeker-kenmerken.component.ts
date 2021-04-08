import { Component, OnInit } from '@angular/core';
import { AppTitleService } from 'src/app/services/app-title.service';

@Component({
  selector: 'app-schoonebeeker-kenmerken',
  templateUrl: './schoonebeeker-kenmerken.component.html',
  styleUrls: ['./schoonebeeker-kenmerken.component.scss']
})
export class SchoonebeekerKenmerkenComponent implements OnInit {

  constructor(titleService: AppTitleService) {
    titleService.setTitle("Kenmerken Schoonebeeker - Fokken");
  }


  ngOnInit(): void {
  }

}
