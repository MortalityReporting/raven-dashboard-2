import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesComponent } from './landing.component';

describe('LandingComponent', () => {
  let component: CasesComponent;
  let fixture: ComponentFixture<CasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
