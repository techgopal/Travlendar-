import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, AlertController, ViewController } from 'ionic-angular';

import { EventServiceProvider } from '../../providers/event-service/event-service';
import { MapServiceProvider } from '../../providers/map-service/map-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

import * as moment from 'moment';

/**
 * Generated class for the EventDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-details',
  templateUrl: 'event-details.html',
})
export class EventDetailsPage {
  event: any;
  location: any;
  loading: any;
  homepage: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public eventServiceProvider: EventServiceProvider, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public mapServiceProvider: MapServiceProvider, public authServiceProvider: AuthServiceProvider, public alertCtrl: AlertController, public viewCtrl: ViewController) {
    this.event = this.navParams.get('event');
    this.location = this.navParams.get('location')[0];
    this.homepage = this.navParams.get('prevPage');
    console.log(this.location);
  }

  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventDetailsPage');
  }
  selectTransport() {
    this.showLoader();
    this.mapServiceProvider.getDirection(this.location.startLoc, this.location.endLoc, "walk").subscribe(data_walk => {
      this.mapServiceProvider.getDirection(this.location.startLoc, this.location.endLoc, "driving").subscribe(data_driving => {
        this.authServiceProvider.getUserTransitPref().subscribe(data_pref => {
          //var pre= "";
          var bus = "";
          var subway = "";
          var train = "";
          var tram = "";
          var rail = "";
          if (data_pref.data[0].BUS == 1) {
            bus = "BUS";
          }
          if (data_pref.data[0].SUBWAY == 1) {
            subway = "SUBWAY";
          }
          if (data_pref.data[0].TRAIN == 1) {
            train = "TRAIN"
          }
          if (data_pref.data[0].TRAM == 1) {
            tram = "TRAM"
          }
          if (data_pref.data[0].RAIL == 1) {
            rail = "RAIL"
          }
          //BECUASE GOOGLE API FREE VERSION DON"T SUPPORT TRANSIT PREF. SKIPPING FURTHER IMPLEMENTATION
          this.mapServiceProvider.getDirectionTmode(this.location.startLoc, this.location.endLoc, "transit", "train|tram|subway").subscribe(data_transit => {
            console.log(data_transit);
            this.loading.dismiss();
            let modal = this.modalCtrl.create('TravelPage', { data_walk: data_walk, data_driving: data_driving, data_transit: data_transit });
            modal.present();
            modal.onDidDismiss(data => {

            });
          });
        });
      })
    });
  }
  editMeeting() {
    // console.log(this.event);
    let modal = this.modalCtrl.create('EditEventPage', { event: this.event, location: this.location, detailPage: this });
    modal.present();
  }
  cancelMeeting() {
    console.log("Cancel");
    let confirm = this.alertCtrl.create({
      title: 'Do You Want To Cancel Meeting?',
      message: 'Please Confirm',
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
            console.log('Agree clicked');
            confirm.present();
            this.eventServiceProvider.deleteEvent(this.event.id).subscribe(
              data => {
                //update home page 
                var prevPage = this.navParams.get('prevPage');
                this.eventServiceProvider.getAllEventDay().subscribe(data => {
                  prevPage.eventList = data.data;
                  prevPage.eventSource = prevPage.getEvents();
                  this.viewCtrl.dismiss();
                });
                
                console.log("CANCLED");
              }
            );
          }
        }
      ]
    });
    confirm.present();
  }
  returnFormatedDate(d) {
    return moment(d).format('MMMM Do YYYY, h:mm:ss a');
  }
}
