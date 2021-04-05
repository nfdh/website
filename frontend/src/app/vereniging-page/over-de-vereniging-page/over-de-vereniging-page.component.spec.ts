import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverDeVerenigingPageComponent } from './over-de-vereniging-page.component';

describe('OverDeVerenigingPageComponent', () => {
  let component: OverDeVerenigingPageComponent;
  let fixture: ComponentFixture<OverDeVerenigingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverDeVerenigingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverDeVerenigingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
