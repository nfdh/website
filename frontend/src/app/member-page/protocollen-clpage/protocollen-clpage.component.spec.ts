import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocollenCLPageComponent } from './protocollen-clpage.component';

describe('ProtocollenCLPageComponent', () => {
  let component: ProtocollenCLPageComponent;
  let fixture: ComponentFixture<ProtocollenCLPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProtocollenCLPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtocollenCLPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
