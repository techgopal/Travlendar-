import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LunchBreakPage } from './lunch-break';

@NgModule({
  declarations: [
    LunchBreakPage,
  ],
  imports: [
    IonicPageModule.forChild(LunchBreakPage),
  ],
})
export class LunchBreakPageModule {}
