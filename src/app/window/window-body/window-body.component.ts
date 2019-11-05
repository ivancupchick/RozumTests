import { Component, OnInit, Host } from '@angular/core';
import { WindowComponent } from '../window.component';

@Component({
  selector: 'app-window-body',
  template: '<ng-content></ng-content>'
})
export class WindowBodyComponent implements OnInit {

  constructor(@Host() public window: WindowComponent) {
  }

  ngOnInit() {
  }

}
