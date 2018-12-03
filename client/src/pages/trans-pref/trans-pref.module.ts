import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransPrefPage } from './trans-pref';

@NgModule({
  declarations: [
    TransPrefPage,
  ],
  imports: [
    IonicPageModule.forChild(TransPrefPage),
  ],
})
export class TransPrefPageModule {}
