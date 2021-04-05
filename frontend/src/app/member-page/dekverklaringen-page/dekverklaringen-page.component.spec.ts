import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DekverklaringenPageComponent } from './dekverklaringen-page.component';

describe('DekverklaringenPageComponent', () => {
  let component: DekverklaringenPageComponent;
  let fixture: ComponentFixture<DekverklaringenPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DekverklaringenPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DekverklaringenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
