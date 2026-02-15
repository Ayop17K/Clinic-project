import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActualPaidPage } from './actual-paid.page';

const routes: Routes = [
  {
    path: '',
    component: ActualPaidPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActualPaidPageRoutingModule {}
