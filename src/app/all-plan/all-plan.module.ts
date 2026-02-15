import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllPlanPageRoutingModule } from './all-plan-routing.module';

import { AllPlanPage } from './all-plan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllPlanPageRoutingModule
  ],
  declarations: [AllPlanPage]
})
export class AllPlanPageModule {}
