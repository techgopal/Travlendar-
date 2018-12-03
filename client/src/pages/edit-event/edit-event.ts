import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ViewController } from 'ionic-angular';

import { EventServiceProvider } from '../../providers/event-service/event-service';

import * as moment from 'moment';
import { locale } from 'moment';

import { LocalNotifications } from '@ionic-native/local-notifications';
/**
 * Generated class for the EditEventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-event',
  templateUrl: 'edit-event.html',
})
export class EditEventPage {
  event = { id: "", title: "", startTime: new Date().toISOString(), locationId: "", endTime: new Date().toISOString(), allDay: false, startLocation: "", isTTEnabled: false, meetingLocation: "", travelTime: "None", travelDistance: "", alert: 5 };
  location: any;
  startTime: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public alertCtrl: AlertController, public eventServiceProvider: EventServiceProvider, public viewCtrl: ViewController, public localNotifications: LocalNotifications) {
    this.event = this.navParams.get('event');
    var location = this.navParams.get('location');
    console.log(this.event);
    this.event.id = this.event.id;
    this.event.isTTEnabled = location.isTTEnabled;
    this.event.locationId = location.locationId;
    this.event.title = this.event.title;
    this.event.meetingLocation = location.endLoc;
    this.event.startLocation = location.startLoc;
    this.event.allDay = this.event.allDay;
    this.event.startTime = new Date(this.navParams.get('event').startTime).toISOString();
    this.event.endTime = new Date(this.navParams.get('event').endTime).toISOString();
    this.event.travelTime = location.time;
    this.event.travelDistance = location.distance;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditEventPage');
  }

  showMeetingAddressModal() {
    let modal = this.modalCtrl.create('SearchLocationPage');
    modal.present();
    modal.onDidDismiss(
      data => {
        if (data != undefined) {
          this.event.meetingLocation = data.description;
        }
      });
  }
  alertFunc(title, subtitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    })
    alert.present();
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  update() {
    if (this.event.allDay == true) {
      var startDateSQL = moment(this.event.startTime).format('YYYY-MM-DD');
      var startTimeSQL = moment(startDateSQL + " 00:00:00").format('YYYY-MM-DD HH:mm:ss');
      var endDateSQL = moment(this.event.endTime).format('YYYY-MM-DD');
      var endTimeSQL = moment(endDateSQL + " 23:59:59").format('YYYY-MM-DD HH:mm:ss');
    } else {
      var startTimeSQL = moment(this.event.startTime).format('YYYY-MM-DD HH:mm:ss');
      var endTimeSQL = moment(this.event.endTime).format('YYYY-MM-DD HH:mm:ss');
    }

    if (this.event.title == "") {
      this.alertFunc("Incomplete Event Title", "Please Enter Event Title");
    } else {
      if (this.event.meetingLocation == "") {
        this.alertFunc("Incomplete Meeting Location", "Please Provide Meeting Location");
      } else {
        //Check FOr Date Validation
        if (startTimeSQL < endTimeSQL) {
          const body = {
            eventId: this.event.id,
            eventName: this.event.title,
            startTime: startTimeSQL,
            endTime: endTimeSQL,
            isAllDay: this.event.allDay,
            isTTEnabled: this.event.isTTEnabled,
            locationId: this.event.locationId,
            startLocation: this.event.startLocation,
            meetingLocation: this.event.meetingLocation,
            travelTime: this.event.travelTime,
            travelDistance: this.event.travelDistance
          };
          if (this.event.isTTEnabled) {
            this.eventServiceProvider.eventConstraints(startTimeSQL, this.event.travelTime).subscribe(
              data => {
                this.eventServiceProvider.updateEvent(body).subscribe(
                  data => {
                    var prevPage = this.navParams.get('detailPage');
                    prevPage.event = this.event;
                    prevPage.location.isTTEnabled = this.event.isTTEnabled;
                    prevPage.location.locationId = this.event.locationId;
                    prevPage.location.startLocation = this.event.startLocation;
                    prevPage.location.endLoc = this.event.meetingLocation;
                    prevPage.location.time = this.event.travelTime;
                    // Schedule delayed notification
                    this.localNotifications.schedule({
                      text: 'Event Alert',
                      at: startTimeSQL,
                      led: 'FF0000',
                      sound: null
                    });
                    this.viewCtrl.dismiss();
                  },
                  error => {
                    //Unreachnable in time
                    //todo: Write code warning box based on its input read forward
                    // console.log(error);
                    let alert = this.alertCtrl.create({
                      title: 'Error',
                      subTitle: error.error.errormsg,
                      buttons: ['OK']
                    })
                    alert.present();
                  }
                );

              },
              error => {
                let confirm = this.alertCtrl.create({
                  title: 'Location Unreachable In Given Time',
                  message: 'Do You Want Continue With Unreachable Destination?',
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
                        this.eventServiceProvider.updateEvent(body).subscribe(
                          data => {
                            var prevPage = this.navParams.get('detailPage');
                            prevPage.event = this.event;
                            prevPage.location.isTTEnabled = this.event.isTTEnabled;
                            prevPage.location.locationId = this.event.locationId;
                            prevPage.location.startLocation = this.event.startLocation;
                            prevPage.location.endLoc = this.event.meetingLocation;
                            prevPage.location.time = this.event.travelTime;
                            // Schedule delayed notification
                            this.localNotifications.schedule({
                              text: 'Event Alert',
                              at: startTimeSQL,
                              led: 'FF0000',
                              sound: null
                            });
                            this.viewCtrl.dismiss();
                          },
                          error => {
                            //Unreachnable in time
                            //todo: Write code warning box based on its input read forward
                            // console.log(error);
                            let alert = this.alertCtrl.create({
                              title: 'Error',
                              subTitle: error.error.errormsg,
                              buttons: ['OK']
                            })
                            alert.present();
                          }
                        );
                      }
                    }
                  ]
                });
                confirm.present();
              }
            );
          } else {
            this.eventServiceProvider.updateEvent(body).subscribe(
              data => {
                var prevPage = this.navParams.get('detailPage');
                prevPage.event = this.event;
                prevPage.location.isTTEnabled = this.event.isTTEnabled;
                prevPage.location.locationId = this.event.locationId;
                prevPage.location.startLocation = this.event.startLocation;
                prevPage.location.endLoc = this.event.meetingLocation;
                prevPage.location.time = this.event.travelTime;
                // Schedule delayed notification
                this.localNotifications.schedule({
                  text: 'Event Alert',
                  at: startTimeSQL,
                  led: 'FF0000',
                  sound: null
                });
                this.viewCtrl.dismiss();
              },
              error => {
                //Unreachnable in time
                //todo: Write code warning box based on its input read forward
                // console.log(error);
                let alert = this.alertCtrl.create({
                  title: 'Error',
                  subTitle: error.error.errormsg,
                  buttons: ['OK']
                })
                alert.present();
              }
            );

          }

        } else {
          // console.log("after");
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'Please Enter Correct Date',
            buttons: ['OK']
          })
          alert.present();
        }
      }
    }//End TITLE IF
  }

  calTravelTime() {
    if (this.event.meetingLocation != "") {
      let modal = this.modalCtrl.create('TravelTimePage', { event: this.event });
      modal.present();
      modal.onDidDismiss(
        data => {
          if (data != undefined) {
            console.log(data);
            if (data.isEnabled) {
              this.event.travelTime = data.time;
              this.event.startLocation = data.startLocation;
              this.event.travelDistance = data.distance;
              this.event.isTTEnabled = data.isEnabled;
            } else {
              this.event.travelTime = "None";
              this.event.startLocation = "";
              this.event.travelDistance = "";
              this.event.isTTEnabled = data.isEnabled;
            }
          }
        });
    } else {
      let alert = this.alertCtrl.create({
        title: 'Please Provide Meeting Location',
        buttons: ['OK']
      });
      alert.present();
    }
  }
}
