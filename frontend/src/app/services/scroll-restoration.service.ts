import { ViewportScroller } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router, Event, Scroll } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScrollRestorationService {

  constructor(router: Router, viewportScroller: ViewportScroller) {
    router.events.pipe(
      filter((e: Event): e is Scroll => e instanceof Scroll)
    ).subscribe(e => {
      if (e.position) {
        // backward navigation
        viewportScroller.scrollToPosition(e.position);
      } else if (e.anchor) {
        // anchor navigation
        viewportScroller.scrollToAnchor(e.anchor);
      } else {
        const scrollPosition = viewportScroller.getScrollPosition();

        if(scrollPosition[1] > 700) {
          // Only scroll when out of view
          viewportScroller.scrollToPosition([0, 640]);
        }
      }
    });
  }
}