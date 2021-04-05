import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalMenuItemComponent } from './vertical-menu-item.component';

describe('VerticalMenuItemComponent', () => {
  let component: VerticalMenuItemComponent;
  let fixture: ComponentFixture<VerticalMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerticalMenuItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
