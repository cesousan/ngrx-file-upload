import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'lib-progress',
  template: `
    <mat-progress-bar [color]="color" [mode]="mode" [value]="progress">
    </mat-progress-bar>
  `,
})
export class ProgressComponent implements OnInit {
  @Input() color = 'primary';
  @Input() mode = 'determinate';
  @Input() progress = 0;

  constructor() {}

  ngOnInit() {}
}
