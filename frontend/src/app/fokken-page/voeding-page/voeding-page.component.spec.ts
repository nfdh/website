import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoedingPageComponent } from './voeding-page.component';

describe('VoedingPageComponent', () => {
  let component: VoedingPageComponent;
  let fixture: ComponentFixture<VoedingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoedingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoedingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
