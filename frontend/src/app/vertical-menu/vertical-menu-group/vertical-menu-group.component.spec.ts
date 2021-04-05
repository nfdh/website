import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalMenuGroupComponent } from './vertical-menu-group.component';

describe('VerticalMenuGroupComponent', () => {
  let component: VerticalMenuGroupComponent;
  let fixture: ComponentFixture<VerticalMenuGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerticalMenuGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalMenuGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
