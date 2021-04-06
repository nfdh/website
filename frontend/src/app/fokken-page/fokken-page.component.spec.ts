import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FokkenPageComponent } from './fokken-page.component';

describe('FokkenPageComponent', () => {
  let component: FokkenPageComponent;
  let fixture: ComponentFixture<FokkenPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FokkenPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FokkenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
