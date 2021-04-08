import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { map } from 'rxjs/operators';
import { AppTitleService } from '../services/app-title.service';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss']
})
export class NotFoundPageComponent {
  path$ = this.route.url
    .pipe(
      map(s => s.join('/'))
    )

  constructor(private route: ActivatedRoute, titleService: AppTitleService) {
    titleService.setTitle("Pagina niet gevonden");
  }
}
