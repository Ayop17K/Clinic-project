import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActualPaidPage } from './actual-paid.page';

describe('ActualPaidPage', () => {
  let component: ActualPaidPage;
  let fixture: ComponentFixture<ActualPaidPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualPaidPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
