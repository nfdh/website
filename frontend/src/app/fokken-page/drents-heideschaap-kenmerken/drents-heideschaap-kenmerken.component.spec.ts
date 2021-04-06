import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrentsHeideschaapKenmerkenComponent } from './drents-heideschaap-kenmerken.component';

describe('DrentsHeideschaapKenmerkenComponent', () => {
  let component: DrentsHeideschaapKenmerkenComponent;
  let fixture: ComponentFixture<DrentsHeideschaapKenmerkenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrentsHeideschaapKenmerkenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrentsHeideschaapKenmerkenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
