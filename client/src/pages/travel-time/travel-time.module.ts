import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TravelTimePage } from './travel-time';

@NgModule({
  declarations: [
    TravelTimePage,
  ],
  imports: [
    IonicPageModule.forChild(TravelTimePage),
  ],
})
export class TravelTimePageModule {}
