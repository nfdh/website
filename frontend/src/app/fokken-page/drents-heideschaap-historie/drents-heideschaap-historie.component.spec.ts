import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrentsHeideschaapHistorieComponent } from './drents-heideschaap-historie.component';

describe('DrentsHeideschaapHistorieComponent', () => {
  let component: DrentsHeideschaapHistorieComponent;
  let fixture: ComponentFixture<DrentsHeideschaapHistorieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrentsHeideschaapHistorieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrentsHeideschaapHistorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
