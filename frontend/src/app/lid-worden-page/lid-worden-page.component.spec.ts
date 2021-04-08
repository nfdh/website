import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LidWordenPageComponent } from './lid-worden-page.component';

describe('LidWordenPageComponent', () => {
  let component: LidWordenPageComponent;
  let fixture: ComponentFixture<LidWordenPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LidWordenPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LidWordenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
