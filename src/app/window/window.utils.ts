import {animate, style, transition, trigger} from '@angular/animations';

export const appearDisappearNotCentered = trigger('appearDisappearNotCentered', [
  transition(':enter', [
    style({transform: 'scale(0.92)', opacity: 0}),
    animate(150, style({transform: 'scale(1)', opacity: 1}))
  ]),
  transition(':leave', [
    style({transform: 'scale(1)', opacity: 1}),
    animate(150, style({transform: 'scale(0.92)', opacity: 0}))
  ])
]);

export const appearDisappearCentered = trigger('appearDisappearCentered', [
  transition(':enter', [
    style({transform: 'scale(0.92) translate(-50%, -50%)', opacity: 0}),
    animate(150, style({transform: 'scale(1) translate(-50%, -50%)', opacity: 1}))
  ]),
  transition(':leave', [
    style({transform: 'scale(1) translate(-50%, -50%)', opacity: 1}),
    animate(150, style({transform: 'scale(0.92) translate(-50%, -50%)', opacity: 0}))
  ])
]);

export const appearDisappear = trigger('appearDisappear', [
  transition(':enter', [
    style({transform: 'scale(0.92) *', opacity: 0}),
    animate(150, style({transform: 'scale(1) *', opacity: 1}))
  ]),
  transition(':leave', [
    style({transform: 'scale(1) *', opacity: 1}),
    animate(150, style({transform: 'scale(0.92) *', opacity: 0}))
  ])
]);
