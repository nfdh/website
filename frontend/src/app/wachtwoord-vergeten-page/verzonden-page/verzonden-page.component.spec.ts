import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerzondenPageComponent } from './verzonden-page.component';

describe('VerzondenPageComponent', () => {
  let component: VerzondenPageComponent;
  let fixture: ComponentFixture<VerzondenPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerzondenPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerzondenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
