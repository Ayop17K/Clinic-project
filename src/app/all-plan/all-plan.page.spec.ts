import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllPlanPage } from './all-plan.page';

describe('AllPlanPage', () => {
  let component: AllPlanPage;
  let fixture: ComponentFixture<AllPlanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
