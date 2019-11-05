import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../window/window.component';
import { WindowHeaderComponent } from './window-header/window-header.component';
import { WindowBodyComponent } from './window-body/window-body.component';
import { WindowActionsComponent } from './window-actions/window-actions.component';

const windowComponents = [WindowComponent, WindowHeaderComponent, WindowBodyComponent, WindowActionsComponent];

@NgModule({
  declarations: windowComponents,
  imports: [
    CommonModule
  ],
  exports: [windowComponents]
})
export class WindowModule { }
