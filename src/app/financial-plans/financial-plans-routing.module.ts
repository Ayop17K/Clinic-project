import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinancialPlansPage } from './financial-plans.page';

const routes: Routes = [
  {
    path: '',
    component: FinancialPlansPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialPlansPageRoutingModule {}
