import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigatorPage } from './navigator.page';

describe('NavigatorPage', () => {
  let component: NavigatorPage;
  let fixture: ComponentFixture<NavigatorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
