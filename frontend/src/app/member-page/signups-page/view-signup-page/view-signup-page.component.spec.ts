import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSignupPageComponent } from './view-signup-page.component';

describe('ViewSignupPageComponent', () => {
  let component: ViewSignupPageComponent;
  let fixture: ComponentFixture<ViewSignupPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSignupPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSignupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
