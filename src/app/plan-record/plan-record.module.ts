import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanRecordPageRoutingModule } from './plan-record-routing.module';

import { PlanRecordPage } from './plan-record.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanRecordPageRoutingModule
  ],
  declarations: [PlanRecordPage]
})
export class PlanRecordPageModule {}
