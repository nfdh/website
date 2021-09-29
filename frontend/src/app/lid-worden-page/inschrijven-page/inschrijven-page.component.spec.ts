import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InschrijvenPageComponent } from './inschrijven-page.component';

describe('InschrijvenPageComponent', () => {
  let component: InschrijvenPageComponent;
  let fixture: ComponentFixture<InschrijvenPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InschrijvenPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InschrijvenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
