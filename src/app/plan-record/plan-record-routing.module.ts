import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanRecordPage } from './plan-record.page';

const routes: Routes = [
  {
    path: '',
    component: PlanRecordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanRecordPageRoutingModule {}
