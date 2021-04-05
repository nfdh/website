import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerenigingPageComponent } from './vereniging-page.component';

describe('VerenigingPageComponent', () => {
  let component: VerenigingPageComponent;
  let fixture: ComponentFixture<VerenigingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerenigingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerenigingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
