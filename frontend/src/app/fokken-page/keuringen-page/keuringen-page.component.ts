import { Component, OnInit } from '@angular/core';
import { AppTitleService } from 'src/app/services/app-title.service';

@Component({
  selector: 'app-keuringen-page',
  templateUrl: './keuringen-page.component.html',
  styleUrls: ['./keuringen-page.component.scss']
})
export class KeuringenPageComponent implements OnInit {

  constructor(titleService: AppTitleService) {
    titleService.setTitle("Keuringen - Fokken");
  }

  ngOnInit(): void {
  }

}
