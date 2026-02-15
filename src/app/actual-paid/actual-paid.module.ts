import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActualPaidPageRoutingModule } from './actual-paid-routing.module';

import { ActualPaidPage } from './actual-paid.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActualPaidPageRoutingModule
  ],
  declarations: [ActualPaidPage]
})
export class ActualPaidPageModule {}
