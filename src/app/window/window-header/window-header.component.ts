import { Component, OnInit, Input, Host, HostListener } from '@angular/core';
import { WindowComponent } from '../window.component';

@Component({
  selector: 'app-window-header',
  templateUrl: './window-header.component.html',
})
export class WindowHeaderComponent implements OnInit {
  @Input() noCloseButton = false;

  constructor(@Host() public window: WindowComponent) {
  }

  @HostListener('mousedown', ['$event']) handleMousedown(event) {
    this.window.handleHeaderMousedown(event);
  }

  @HostListener('document:keydown.escape', ['$event']) handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.noCloseButton) {
      this.handleClose(event);
    }
  }

  ngOnInit() {
  }

  // handlePin(event) {
  //   event.stopPropagation();
  //   this.modal.togglePin();
  // }

  handleCloseMousedown(event) {
    event.stopPropagation();
  }

  handleClose(event) {
    event.stopPropagation();
    this.window.close();
  }

}
