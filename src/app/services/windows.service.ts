import {
  Injectable,
  Type,
  ComponentRef,
  ApplicationRef,
  ComponentFactoryResolver,
  Injector,
  EmbeddedViewRef,
  OnDestroy
} from '@angular/core';

@Injectable()
export class WindowsService implements OnDestroy {
  private componentRef: ComponentRef<any>;

  constructor(private appRef: ApplicationRef, private componentFactoryResolver: ComponentFactoryResolver, private injector: Injector) { }

  ngOnDestroy() {
    this.close();
  }

  showWindow<TWindow, TResult>(
    component: Type<TWindow>,
    updater: (instance: TWindow, close: (res: TResult) => void) => void,
    savePreviousWindow?: boolean
  ): Promise<TResult> {
    let previousWindow;

    return new Promise<TResult>(resolve => {
      if (savePreviousWindow) {
        previousWindow = this.componentRef;
      } else {
        this.close();
      }

      this.componentRef = this.createComponentInBody(component);

      updater(this.componentRef.instance, res => {
        this.close();
        resolve(res);
        this.componentRef = previousWindow;
      });
    });
  }

  close(window?: any) {
    if (this.componentRef && (!window || this.componentRef.instance === window)) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  private createComponentInBody(component: any): ComponentRef<any> {
    const componentRef = this.componentFactoryResolver.resolveComponentFactory(component).create(this.injector);
    this.appRef.attachView(componentRef.hostView);
    const domElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElement);

    return componentRef;
  }
}
