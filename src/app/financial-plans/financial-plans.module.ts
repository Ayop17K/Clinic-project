import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinancialPlansPageRoutingModule } from './financial-plans-routing.module';

import { FinancialPlansPage } from './financial-plans.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinancialPlansPageRoutingModule
  ],
  declarations: [FinancialPlansPage]
})
export class FinancialPlansPageModule {}
