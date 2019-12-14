import { Injectable, ComponentRef, ViewContainerRef, Type } from '@angular/core';

@Injectable()
export class ModalContext<T> {

  private componentRef: ComponentRef<Type<any>>;
  private containerRef: ViewContainerRef;

  data?: T;

  private resolveValue: (...args: any[]) => void;
  private rejectValue: (...args: any[]) => void;
  private promiseValue: Promise<any>;

  constructor() { }

  private hide() {
    // console.log(this.containerRef.indexOf(this.componentRef.hostView));
    this.containerRef.remove(0); // this.containerRef.indexOf(this.componentRef.hostView)
  }

  resolve(...args: any[]) {
    this.hide();
    this.resolveValue(...args);
  }

  reject(reason: any) {
    this.hide();
    this.rejectValue(reason);
  }

  public promise(componentRef: ComponentRef<Type<any>>, containerRef: ViewContainerRef): Promise<any> {
    return this.promiseValue || (this.promiseValue = new Promise((resolve, reject) => {
      this.componentRef = componentRef;
      this.containerRef = containerRef;
      this.resolveValue = resolve;
      this.rejectValue = reject;
    }));
  }
}
