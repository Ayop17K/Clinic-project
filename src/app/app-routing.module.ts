import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AdminGuard, AuthGuard } from './admin-auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'navigator',
    loadChildren: () => import('./navigator/navigator.module').then( m => m.NavigatorPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'financial-plans',
    redirectTo: 'navigator/financial-plans',
    pathMatch: 'full'
  },
  {
    path: 'all-plan',
    redirectTo: 'navigator/all-plan',
    pathMatch: 'full'
  },
  {
    path: 'plan-record',
    redirectTo: 'navigator/plan-record',
    pathMatch: 'full'
  },
  {
    path: 'actual-paid',
    redirectTo: 'navigator/actual-paid',
    pathMatch: 'full'
  },
  {
    path: 'records',
    redirectTo: 'navigator/records',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
