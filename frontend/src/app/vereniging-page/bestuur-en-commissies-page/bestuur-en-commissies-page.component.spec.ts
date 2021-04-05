import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestuurEnCommissiesPageComponent } from './bestuur-en-commissies-page.component';

describe('BestuurEnCommissiesPageComponent', () => {
  let component: BestuurEnCommissiesPageComponent;
  let fixture: ComponentFixture<BestuurEnCommissiesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BestuurEnCommissiesPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BestuurEnCommissiesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
