import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { NavigatorPageRoutingModule } from './navigator-routing.module';

import { NavigatorPage } from './navigator.page';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    NavigatorPageRoutingModule
  ],
  declarations: [NavigatorPage]
})
export class NavigatorPageModule {}
