import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoonebeekerHistorieComponent } from './schoonebeeker-historie.component';

describe('SchoonebeekerHistorieComponent', () => {
  let component: SchoonebeekerHistorieComponent;
  let fixture: ComponentFixture<SchoonebeekerHistorieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoonebeekerHistorieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoonebeekerHistorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
