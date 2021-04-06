import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InleidingPageComponent } from './inleiding-page.component';

describe('InleidingPageComponent', () => {
  let component: InleidingPageComponent;
  let fixture: ComponentFixture<InleidingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InleidingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InleidingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
