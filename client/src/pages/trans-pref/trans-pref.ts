import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the TransPrefPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-trans-pref',
  templateUrl: 'trans-pref.html',
})
export class TransPrefPage {
  pref: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authServiceProvider: AuthServiceProvider) {
    this.authServiceProvider.getUserTransitPref().subscribe(data => {
      this.pref = data.data[0];
    });
  }

  update() {
    this.authServiceProvider.updateUserTransitPref(this.pref.BUS,this.pref.SUBWAY,this.pref.TRAIN,this.pref.TRAM,this.pref.RAIL).subscribe(data => {
      console.log(data);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransPrefPage');
  }

}
