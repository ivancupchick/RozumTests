import { Component, OnInit, Host } from '@angular/core';
import { WindowComponent } from '../window.component';

@Component({
  selector: 'app-window-actions',
  template: '<ng-content></ng-content>',
  styleUrls: ['./window-actions.component.sass']
})
export class WindowActionsComponent implements OnInit {

  constructor(@Host() public window: WindowComponent) {
  }

  ngOnInit() {
  }

}
