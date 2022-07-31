import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructieRvoMachtigingComponent } from './instructie-rvo-machtiging.component';

describe('InstructieRvoMachtigingComponent', () => {
  let component: InstructieRvoMachtigingComponent;
  let fixture: ComponentFixture<InstructieRvoMachtigingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructieRvoMachtigingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructieRvoMachtigingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
