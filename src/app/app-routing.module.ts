import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './admin-auth.guard';
import { NavigatorPage } from './navigator/navigator.page';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'navigator',
    component: NavigatorPage,
    canActivate: [AdminGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'financial-plans',
    loadChildren: () => import('./financial-plans/financial-plans.module').then( m => m.FinancialPlansPageModule)
  },
  {
    path: 'all-plan',
    loadChildren: () => import('./all-plan/all-plan.module').then( m => m.AllPlanPageModule)
  },
  {
    path: 'plan-record',
    loadChildren: () => import('./plan-record/plan-record.module').then( m => m.PlanRecordPageModule)
  },
  {
    path: 'actual-paid',
    loadChildren: () => import('./actual-paid/actual-paid.module').then( m => m.ActualPaidPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
