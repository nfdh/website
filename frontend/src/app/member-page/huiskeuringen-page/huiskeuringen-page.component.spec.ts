import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HuiskeuringenPageComponent } from './huiskeuringen-page.component';

describe('HuiskeuringenPageComponent', () => {
  let component: HuiskeuringenPageComponent;
  let fixture: ComponentFixture<HuiskeuringenPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HuiskeuringenPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HuiskeuringenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
