import { Component } from '@angular/core';
import { AppTitleService } from 'src/app/services/app-title.service';

@Component({
  selector: 'app-drents-heideschaap-kenmerken',
  templateUrl: './drents-heideschaap-kenmerken.component.html',
  styleUrls: ['./drents-heideschaap-kenmerken.component.scss']
})
export class DrentsHeideschaapKenmerkenComponent {

  constructor(titleService: AppTitleService) {
    titleService.setTitle("Kenmerken Drents Heideschaap - Fokken");
  }

}
