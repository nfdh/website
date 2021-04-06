import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegelgevingPageComponent } from './regelgeving-page.component';

describe('RegelgevingPageComponent', () => {
  let component: RegelgevingPageComponent;
  let fixture: ComponentFixture<RegelgevingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegelgevingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegelgevingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
