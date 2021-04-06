import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoonebeekerKenmerkenComponent } from './schoonebeeker-kenmerken.component';

describe('SchoonebeekerKenmerkenComponent', () => {
  let component: SchoonebeekerKenmerkenComponent;
  let fixture: ComponentFixture<SchoonebeekerKenmerkenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoonebeekerKenmerkenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoonebeekerKenmerkenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
