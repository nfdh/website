import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDekverklaringPageComponent } from './edit-dekverklaring-page.component';

describe('EditDekverklaringPageComponent', () => {
  let component: EditDekverklaringPageComponent;
  let fixture: ComponentFixture<EditDekverklaringPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDekverklaringPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDekverklaringPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
