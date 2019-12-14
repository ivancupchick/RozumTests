import { Component, OnInit, Input, EventEmitter, Output, Inject, Renderer2,
  NgZone, ChangeDetectorRef, ViewChild, ElementRef, HostListener, AfterViewInit,
  ViewEncapsulation, OnChanges, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
import { appearDisappearNotCentered, appearDisappearCentered, appearDisappear } from './window.utils';

export enum GrabPlaces {
  header,
  none,
  top,
  right,
  bottom,
  left,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight
}

export interface ModalSizes {
  top: number;
  left: number;
  wight: number;
  height: number;
}

let maxZIndex = 10000;

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [appearDisappearNotCentered, appearDisappearCentered, appearDisappear]
})
export class WindowComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  readonly grabPlaces = GrabPlaces;

  constructor(@Inject(DOCUMENT) private document: Document,
              private renderer: Renderer2,
              private ngZone: NgZone,
              private cd: ChangeDetectorRef,
              ) {
  }
  // private sessionService: SessionService

  private grabTop;
  private grabLeft;
  private grabPlace = GrabPlaces.none;
  private subs = new Subscription();

  isGrabbed = false;
  isResized = false;
  // isPinned = false;
  // isCentered = true;
  show = true;
  modal: ClientRect;
  zIndex = ++maxZIndex;

  visibility: 'visible' | 'hidden' = 'visible';

  private loadedModal = false;
  private oldWidth: number;
  private oldHeight: number;

  public safeTop: number;
  get top() { return this.safeTop; }
  @Input() set top(value) {
    value = typeof value === 'string' ? this.getSizeFromString(value, window.innerWidth) : value;

    const maxValue: number = window.innerHeight - 20;
    this.safeTop = value < 0 ? 0 : value > maxValue ? maxValue : value;
  }

  public safeLeft: number;
  get left() { return this.safeLeft; }
  @Input() set left(value) {
    value = typeof value === 'string' ? this.getSizeFromString(value, window.innerWidth) : value;

    const maxValue: number = window.innerWidth + (+this.safeWidth - 20);
    const minValue: number = 0 - (+this.safeWidth - 20);

    this.safeLeft = value < minValue ? minValue : value > maxValue ? maxValue : value;
  }

  public safeWidth: number;
  @Input() set width(value) {
    this.setSize(value, 'width');
  }
  get width() {
    return this.safeWidth;
  }

  public safeHeight: number;
  @Input() set height(value) {
    this.setSize(value, 'height');
  }
  get height() {
    return this.safeHeight;
  }

  // @Input() name: LocalStorageKeys;
  // @Input() resizable = false;
  @Input() showBackgroundMask = true;
  @Input() isPinnable = false;
  @Input() minWidth = 200;
  @Input() minHeight = 200;
  @Input() maxWidth: number;
  @Input() maxHeight: number;
  @Input() closeOnClickOutside = false;
  @Input() anchorElement: HTMLElement;
  @Output() closeOut = new EventEmitter();
  @ViewChild('element') element: ElementRef;

  // @HostListener('window:resize', ['$event']) handleWindowResize = debounce((event) => {
  //   if (this.anchorElement) {
  //     this.locateModalToAnchor();
  //   }
  // }, 70);

  handleClickOutside() {
    if (this.closeOnClickOutside) {
      this.close();
    }
  }

  ngAfterViewInit() {
    if (this.anchorElement) {
      this.locateModalToAnchor();
      return;
    }

    if (!this.top && !this.left) {
      this.locateModalToCenter();
      this.cd.detectChanges();
    }

    this.loadedModal = true;
  }

  ngOnInit(): void {
    if (this.showBackgroundMask) {
      this.addMask();
    }

    // if (this.resizable && this.name && localStorage.getItem(this.name)) {
    //   this.loadStyles();
    //   this.isPinned = true;
    // }

    // if (this.anchorElement) {
    //   this.isCentered = false;
    // }
  }

  // loadStyles() {
  //   const sizes: ModalSizes = JSON.parse(localStorage.getItem(this.name));

  //   this._top = sizes.top; // priority higher than outside size
  //   this._left = sizes.left; // priority higher than outside size
  //   this._width = sizes.width; // priority higher than outside size
  //   this._height = sizes.height; // priority higher than outside size
  // }

  ngOnChanges(changes) {
    if (this.anchorElement) {
      this.locateModalToAnchor();
      return;
    }

    if ((changes.top && this.top) || (changes.left && this.left)) {
      this.top = this.top || this.element.nativeElement.getBoundingClientRect().top;
      this.left = this.left || this.element.nativeElement.getBoundingClientRect().left;
      // this.isCentered = false;
    }
  }

  handleHeaderMousedown(event) {
    event.stopPropagation();
    this.isGrabbed = true;
    this.grabPlace = GrabPlaces.header;
    this.grab(event);
  }

  enableResize(event, grabPlace: GrabPlaces) {
    this.isResized = true;
    this.grabPlace = grabPlace;
    this.grab(event);
  }

  grab(event) {
    this.modal = this.element.nativeElement.getBoundingClientRect();
    this.grabTop = event.pageY;
    this.grabLeft = event.pageX;
    this.top = this.modal.top;
    this.left = this.modal.left;
    // this.isCentered = false;
    this.cd.detectChanges();

    this.ngZone.runOutsideAngular(() => {
      const removeMousemoveListener = this.renderer.listen('window', 'mousemove', (mousemoveEvent) => {
        this.modal = this.element.nativeElement.getBoundingClientRect();

        mousemoveEvent.preventDefault();

        if (mousemoveEvent.pageX <= 0 || mousemoveEvent.pageY <= 0
          || mousemoveEvent.pageX >= window.innerWidth || mousemoveEvent.pageY >= window.innerHeight) {
          removeMousemoveListener();
          this.drop();
          return;
        }

        switch (this.grabPlace) {
          case GrabPlaces.none:
            break;

          case GrabPlaces.header:
            this.top = this.modal.top + mousemoveEvent.pageY - this.grabTop;
            this.left = this.modal.left + mousemoveEvent.pageX - this.grabLeft;
            break;

          case GrabPlaces.top:
            this.top = this.modal.top + mousemoveEvent.pageY - this.grabTop;
            this.height = this.modal.height + this.grabTop - mousemoveEvent.pageY;
            break;

          case GrabPlaces.right:
            this.width = this.modal.width + mousemoveEvent.pageX - this.grabLeft;
            break;

          case GrabPlaces.bottom:
            this.height = this.modal.height + mousemoveEvent.pageY - this.grabTop;
            break;

          case GrabPlaces.left:
            this.left = this.modal.left + mousemoveEvent.pageX - this.grabLeft;
            this.width = this.modal.width + this.grabLeft - mousemoveEvent.pageX;
            break;

          case GrabPlaces.topLeft:
            this.top = this.modal.top + mousemoveEvent.pageY - this.grabTop;
            this.height = this.modal.height + this.grabTop - mousemoveEvent.pageY;
            this.width = this.modal.width + this.grabLeft - mousemoveEvent.pageX;
            this.left = this.modal.left + mousemoveEvent.pageX - this.grabLeft;
            break;

          case GrabPlaces.topRight:
            this.top = this.modal.top + mousemoveEvent.pageY - this.grabTop;
            this.height = this.modal.height + this.grabTop - mousemoveEvent.pageY;
            this.width = this.modal.width + mousemoveEvent.pageX - this.grabLeft;
            break;

          case GrabPlaces.bottomLeft:
            this.height = this.modal.height + mousemoveEvent.pageY - this.grabTop;
            this.width = this.modal.width + this.grabLeft - mousemoveEvent.pageX;
            this.left = this.modal.left + mousemoveEvent.pageX - this.grabLeft;
            break;

          case GrabPlaces.bottomRight:
            this.width = this.modal.width + mousemoveEvent.pageX - this.grabLeft;
            this.height = this.modal.height + mousemoveEvent.pageY - this.grabTop;
            break;
        }

        this.cd.markForCheck();
        this.grabTop = mousemoveEvent.pageY;
        this.grabLeft = mousemoveEvent.pageX;
      });


      const removeMouseupListener = this.renderer.listen('window', 'mouseup', (mouseupEvent) => {
        removeMouseupListener();
        removeMousemoveListener();
        this.drop();
        this.cd.detectChanges();
      });
    });
  }

  drop() {
    this.isGrabbed = false;
    this.isResized = false;
    this.grabPlace = GrabPlaces.none;
    // if (this.isPinned) {
    //   this.save();
    // }
  }

  addMask() {
    this.showBackgroundMask = true;
  }

  removeMask() {
    this.showBackgroundMask = false;
  }

  close() {
    this.show = false;
    this.closeOut.emit();
  }

  ngOnDestroy(): void {
    if (this.showBackgroundMask) {
      this.removeMask();
    }
    this.subs.unsubscribe();
  }

  // save() {
  //   const sizes: ModalSizes = {top: this.top, left: this.left, width: this.width, height: this.height};
  //   localStorage.setItem(this.name, JSON.stringify(sizes));
  // }

  // unsave() {
  //   localStorage.removeItem(this.name);
  // }

  // togglePin() {
  //   if (this.isPinned) {
  //     this.unsave();
  //     this.isPinned = false;
  //   } else {
  //     this.save();
  //     this.isPinned = true;
  //   }
  // }

  locateModalToCenter() {
    const top = this.top;
    const left = this.left;

    this.top = 0;
    this.left = 0;
    this.cd.detectChanges();

    const width = this.maxWidth && this.width >= this.maxWidth ? this.maxWidth : this.width || this.getComputedSize('width');
    const height = this.maxHeight && this.height >= this.maxHeight ? this.maxHeight : this.height || this.getComputedSize('height');

    this.top = top;
    this.left = left;

    if (!height || !width) {
      return;
    }

    this.cd.detectChanges();
    this.top = (window.innerHeight / 2) - (height / 2);
    this.left = (window.innerWidth / 2) - (width / 2);

    this.oldWidth = width;
    this.oldHeight = height;
  }

  locateModalToAnchor() {
    const anchor = this.anchorElement.getBoundingClientRect();
    const margin = 10;

    this.top = margin + anchor.top + anchor.height;
    this.left = anchor.left;
  }

  private locateWindowRelativeToCenter(type: 'width' | 'height', oldValue: number, newValue: number) {
    const difference = newValue - oldValue;

    if (type === 'width') {
      this.left -= (difference / 2);
    } else {
      this.top -= (difference / 2);
    }
  }

  private getSizeFromString(value: string, viewportSize: number): number {
    return value.match('%') ? viewportSize * +(value.match(/\d+/)[0]) * 0.01 : +value;
  }

  private setSize(value: string | number, type: 'width' | 'height') {
    const viewportSize: number = type === 'width' ? window.innerWidth : window.innerHeight;

    if (this.isResized && typeof value === 'number') {
      if (type === 'width') {
        this.oldWidth = value;
        this.safeWidth = value;
      } else {
        this.oldHeight = value;
        this.safeHeight = value;
      }
      return;
    }

    if (type === 'width') {
      this.oldWidth = this.width || this.getComputedSize(type);
    } else {
      this.oldHeight = this.height || this.getComputedSize(type);
    }

    if (!this.loadedModal) {
      value = typeof value === 'string' ? this.getSizeFromString(value, viewportSize) : value;

      if (type === 'width') {
        this.oldWidth = value || null;
        this.safeWidth = value || null;
      } else {
        this.oldHeight = value || null;
        this.safeHeight = value || null;
      }
      return;
    } else if (!value || (typeof value === 'string' && value === 'auto')) {
      if (type === 'width') {
        this.safeWidth = null;
      } else {
        this.safeHeight = null;
      }
      this.visibility = 'hidden';
      return;
    }

    value = typeof value === 'string' ? this.getSizeFromString(value, viewportSize) : value;

    if (type === 'width' && this.left) {
      this.locateWindowRelativeToCenter(type, this.oldWidth, value);
    } else if (type === 'height' && this.top) {
      this.locateWindowRelativeToCenter(type, this.oldHeight, value);
    }

    if (type === 'width') {
      this.oldWidth = value;
      this.safeWidth = value;
    } else {
      this.oldHeight = value;
      this.safeHeight = value;
    }
  }

  private getComputedSize(type: 'width' | 'height'): number {
    return (this.element && this.element.nativeElement
      ? (type === 'height'
        ? +(getComputedStyle(this.element.nativeElement).height.slice(0, -2))
        : +(getComputedStyle(this.element.nativeElement).width.slice(0, -2)))
      : null);
  }

  onResize() {
    // if (this.resizable) {
    //   this.save();
    // }
    const newWidth = this.getComputedSize('width');
    const newHeight = this.getComputedSize('height');

    if (!this.isResized) {
      if (this.oldHeight && newHeight && this.oldHeight !== newHeight) {
        this.locateWindowRelativeToCenter('height', this.oldHeight, newHeight);
        this.visibility = 'visible';
        this.cd.detectChanges();
      }

      if (this.oldWidth && newWidth && this.oldWidth !== newWidth) {
        this.locateWindowRelativeToCenter('width', this.oldWidth, newWidth);
        this.visibility = 'visible';
        this.cd.detectChanges();
      }
    }

    this.oldHeight = newHeight;
    this.oldWidth = newWidth;
  }
}
