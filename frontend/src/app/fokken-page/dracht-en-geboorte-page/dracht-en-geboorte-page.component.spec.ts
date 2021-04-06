import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrachtEnGeboortePageComponent } from './dracht-en-geboorte-page.component';

describe('DrachtEnGeboortePageComponent', () => {
  let component: DrachtEnGeboortePageComponent;
  let fixture: ComponentFixture<DrachtEnGeboortePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrachtEnGeboortePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrachtEnGeboortePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
