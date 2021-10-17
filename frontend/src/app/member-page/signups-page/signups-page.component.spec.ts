import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupsPageComponent } from './signups-page.component';

describe('SignupsPageComponent', () => {
  let component: SignupsPageComponent;
  let fixture: ComponentFixture<SignupsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
