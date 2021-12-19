import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FalcooPageComponent } from './falcoo-page.component';

describe('FalcooPageComponent', () => {
  let component: FalcooPageComponent;
  let fixture: ComponentFixture<FalcooPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FalcooPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FalcooPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
