import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WachtwoordVergetenPageComponent } from './wachtwoord-vergeten-page.component';

describe('WachtwoordVergetenPageComponent', () => {
  let component: WachtwoordVergetenPageComponent;
  let fixture: ComponentFixture<WachtwoordVergetenPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WachtwoordVergetenPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WachtwoordVergetenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
