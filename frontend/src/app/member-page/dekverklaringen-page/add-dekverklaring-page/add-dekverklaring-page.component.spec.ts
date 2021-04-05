import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDekverklaringPageComponent } from './add-dekverklaring-page.component';

describe('AddDekverklaringPageComponent', () => {
  let component: AddDekverklaringPageComponent;
  let fixture: ComponentFixture<AddDekverklaringPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDekverklaringPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDekverklaringPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
