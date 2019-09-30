import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalContainerComponent } from './modal-container/modal-container.component';
import { ModalService } from './modal.service';
import { ModalHolderDirective } from './modal-holder.directive';
import { ModalContext } from './modal-context';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    ModalContainerComponent,
    ModalHolderDirective
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule
  ],
  entryComponents: [ModalContainerComponent],
  exports: [ModalContainerComponent, ModalHolderDirective],
  providers: [
    ModalContext
    // ModalService
  ]
})
export class ModalModule { }
