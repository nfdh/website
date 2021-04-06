import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WormbestrijdingPageComponent } from './wormbestrijding-page.component';

describe('WormbestrijdingPageComponent', () => {
  let component: WormbestrijdingPageComponent;
  let fixture: ComponentFixture<WormbestrijdingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WormbestrijdingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WormbestrijdingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
