import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NavigatorPage } from './navigator.page';
import { AdminGuard, AuthGuard } from '../admin-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: NavigatorPage,
    children: [
      {
        path: 'financial-plans',
        loadChildren: () => import('../financial-plans/financial-plans.module').then( m => m.FinancialPlansPageModule),
        canActivate: [AdminGuard]
      },
      {
        path: 'all-plan',
        loadChildren: () => import('../all-plan/all-plan.module').then( m => m.AllPlanPageModule),
        canActivate: [AdminGuard]
      },
      {
        path: 'plan-record',
        loadChildren: () => import('../plan-record/plan-record.module').then( m => m.PlanRecordPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'actual-paid',
        loadChildren: () => import('../actual-paid/actual-paid.module').then( m => m.ActualPaidPageModule),
        canActivate: [AdminGuard]
      },
      {
        path: 'records',
        loadChildren: () => import('../records/records.module').then( m => m.RecordsPageModule),
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NavigatorPageRoutingModule {}
