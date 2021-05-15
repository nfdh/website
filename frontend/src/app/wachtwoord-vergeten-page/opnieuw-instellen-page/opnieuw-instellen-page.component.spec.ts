import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpnieuwInstellenPageComponent } from './opnieuw-instellen-page.component';

describe('OpnieuwInstellenPageComponent', () => {
  let component: OpnieuwInstellenPageComponent;
  let fixture: ComponentFixture<OpnieuwInstellenPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpnieuwInstellenPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpnieuwInstellenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
