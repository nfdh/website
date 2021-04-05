import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HuiskeuringFormComponent } from './huiskeuring-form.component';

describe('HuiskeuringFormComponent', () => {
  let component: HuiskeuringFormComponent;
  let fixture: ComponentFixture<HuiskeuringFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HuiskeuringFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HuiskeuringFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
