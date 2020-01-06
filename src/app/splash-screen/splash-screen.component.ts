import {ApplicationRef, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {animate, animateChild, query, style, transition, trigger} from '@angular/animations';
import {PwaService} from '../pwa.service';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('fadeOut', [
      transition(':leave', [
        query(':leave', animateChild(), {optional: true}),
        animate(1000, style({opacity: 0}))
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SplashScreenComponent implements OnInit {
  show = true;

  constructor(
      private pwaService: PwaService,
      private cdr: ChangeDetectorRef,
      private appRef: ApplicationRef,
  ) {
  }

  ngOnInit() {
    this.pwaService.checkForUpdate()
        .subscribe(result => {
          this.show = result;
          this.cdr.detectChanges();
        });
  }
}
