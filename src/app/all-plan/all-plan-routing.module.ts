import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllPlanPage } from './all-plan.page';

const routes: Routes = [
  {
    path: '',
    component: AllPlanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllPlanPageRoutingModule {}
