import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowBodyComponent } from './window-body.component';

describe('WindowBodyComponent', () => {
  let component: WindowBodyComponent;
  let fixture: ComponentFixture<WindowBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WindowBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
