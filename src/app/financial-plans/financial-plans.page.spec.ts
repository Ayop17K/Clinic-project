import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancialPlansPage } from './financial-plans.page';

describe('FinancialPlansPage', () => {
  let component: FinancialPlansPage;
  let fixture: ComponentFixture<FinancialPlansPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialPlansPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
