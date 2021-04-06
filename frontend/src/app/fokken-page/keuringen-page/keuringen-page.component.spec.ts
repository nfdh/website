import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeuringenPageComponent } from './keuringen-page.component';

describe('KeuringenPageComponent', () => {
  let component: KeuringenPageComponent;
  let fixture: ComponentFixture<KeuringenPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeuringenPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeuringenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
