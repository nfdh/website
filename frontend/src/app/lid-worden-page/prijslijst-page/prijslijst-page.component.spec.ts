import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrijslijstPageComponent } from './prijslijst-page.component';

describe('PrijslijstPageComponent', () => {
  let component: PrijslijstPageComponent;
  let fixture: ComponentFixture<PrijslijstPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrijslijstPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrijslijstPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
