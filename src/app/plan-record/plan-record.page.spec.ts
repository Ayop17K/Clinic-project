import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanRecordPage } from './plan-record.page';

describe('PlanRecordPage', () => {
  let component: PlanRecordPage;
  let fixture: ComponentFixture<PlanRecordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanRecordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
