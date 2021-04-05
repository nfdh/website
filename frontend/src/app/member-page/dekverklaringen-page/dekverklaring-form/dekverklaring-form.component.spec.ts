import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DekverklaringFormComponent } from './dekverklaring-form.component';

describe('DekverklaringFormComponent', () => {
  let component: DekverklaringFormComponent;
  let fixture: ComponentFixture<DekverklaringFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DekverklaringFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DekverklaringFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
