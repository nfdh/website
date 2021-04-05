import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHuiskeuringPageComponent } from './add-huiskeuring-page.component';

describe('AddHuiskeuringPageComponent', () => {
  let component: AddHuiskeuringPageComponent;
  let fixture: ComponentFixture<AddHuiskeuringPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHuiskeuringPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHuiskeuringPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
