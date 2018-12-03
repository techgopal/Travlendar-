import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, LoadingController, AlertController } from 'ionic-angular';

import { MapServiceProvider } from '../../providers/map-service/map-service';
/**
 * Generated class for the TravelTimePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-travel-time',
  templateUrl: 'travel-time.html',
})
export class TravelTimePage {
  locationTravelTime = { isEnabled: false, startLocation: "", endLocation: "", time: "", distance: "" };
  events;
  loading;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public modalCtrl: ModalController, public mapServiceProvider: MapServiceProvider, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.events = this.navParams.get('event');
    this.locationTravelTime.startLocation = this.events.startLocation;
    this.locationTravelTime.isEnabled = this.events.isTTEnabled;
    this.locationTravelTime.startLocation = this.events.startLocation;
    this.locationTravelTime.endLocation = this.events.meetingLocation;
    this.locationTravelTime.time = this.events.travelTime;
    this.locationTravelTime.distance = this.events.travelDistance;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TravelTimePage');
  }
  save() {
    if (this.locationTravelTime.isEnabled && this.locationTravelTime.startLocation == "") {
      let confirm = this.alertCtrl.create({
        title: 'Start Location Not Provided',
        message: 'Do you want to continue without Starting Location?',
        buttons: [
          {
            text: 'Disagree',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Agree',
            handler: () => {
              this.locationTravelTime.isEnabled = false;
              this.viewCtrl.dismiss(this.locationTravelTime);
            }
          }
        ]
      });
      confirm.present();

    } else {
      this.viewCtrl.dismiss(this.locationTravelTime);
    }
  }
  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: 'Calculating...'
    });
    this.loading.present();
  }
  toggleBox(item) {
    if (this.locationTravelTime.isEnabled == false) {
      console.log("Toggle" + this.locationTravelTime.isEnabled);
      this.locationTravelTime.time = "";
      this.locationTravelTime.distance = "";
      this.locationTravelTime.startLocation = "";
    }
  }
  showEndAddressModal() {
    let modal = this.modalCtrl.create('SearchLocationPage');
    modal.present();
    modal.onDidDismiss(
      data => {
        if (data != undefined) {
          this.showLoader();
          this.locationTravelTime.startLocation = data.description;
          if (this.locationTravelTime.startLocation != "" && this.locationTravelTime.endLocation != "") {
            this.mapServiceProvider.getTimeDistance(this.locationTravelTime.startLocation, this.locationTravelTime.endLocation).subscribe(data => {
              console.log(data.rows[0].elements[0].distance.text);
              console.log(data.rows[0].elements[0].duration.text);
              if (data != undefined) {
                this.locationTravelTime.time = data.rows[0].elements[0].duration.text;
                this.locationTravelTime.distance = data.rows[0].elements[0].distance.text;
                this.loading.dismiss();
              }
            });
          } else {
            this.loading.dismiss();
          }
        }
      });
  }
}
