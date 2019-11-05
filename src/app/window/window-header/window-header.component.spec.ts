import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowHeaderComponent } from './window-header.component';

describe('WindowHeaderComponent', () => {
  let component: WindowHeaderComponent;
  let fixture: ComponentFixture<WindowHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WindowHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
