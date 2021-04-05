import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarSeparatorComponent } from './toolbar-separator.component';

describe('ToolbarSeparatorComponent', () => {
  let component: ToolbarSeparatorComponent;
  let fixture: ComponentFixture<ToolbarSeparatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolbarSeparatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarSeparatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
