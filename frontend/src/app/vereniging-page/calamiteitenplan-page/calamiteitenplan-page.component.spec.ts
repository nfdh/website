import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalamiteitenplanPageComponent } from './calamiteitenplan-page.component';

describe('CalamiteitenplanPageComponent', () => {
  let component: CalamiteitenplanPageComponent;
  let fixture: ComponentFixture<CalamiteitenplanPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalamiteitenplanPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalamiteitenplanPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
