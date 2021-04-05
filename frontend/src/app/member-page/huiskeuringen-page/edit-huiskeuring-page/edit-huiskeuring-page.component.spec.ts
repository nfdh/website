import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHuiskeuringPageComponent } from './edit-huiskeuring-page.component';

describe('EditHuiskeuringPageComponent', () => {
  let component: EditHuiskeuringPageComponent;
  let fixture: ComponentFixture<EditHuiskeuringPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditHuiskeuringPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHuiskeuringPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
