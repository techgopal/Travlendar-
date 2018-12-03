import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';

import { MapServiceProvider } from '../../providers/map-service/map-service';

/**
 * Generated class for the TravelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-travel',
  templateUrl: 'travel.html',
})
export class TravelPage {
  location: any;
  loading: any;
  data_walk: any;
  data_driving:any;
  data_transit:any;
  mode:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public mapServiceProvider: MapServiceProvider, public viewCtrl: ViewController) {
    this.data_walk = this.navParams.get('data_walk');
    this.data_driving = this.navParams.get('data_driving');
    this.data_transit = this.navParams.get('data_transit');
    this.mode="WALK";   
  }

  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();
  }
  cancel() {
    this.viewCtrl.dismiss();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad TravelPage');
  }

}
