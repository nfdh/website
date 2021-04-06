import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GezondheidPageComponent } from './gezondheid-page.component';

describe('GezondheidPageComponent', () => {
  let component: GezondheidPageComponent;
  let fixture: ComponentFixture<GezondheidPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GezondheidPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GezondheidPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
