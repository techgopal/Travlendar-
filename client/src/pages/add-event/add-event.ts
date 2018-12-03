import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, ViewController } from 'ionic-angular';

import * as moment from 'moment';
import { EventServiceProvider } from '../../providers/event-service/event-service';
import { LocalNotifications } from '@ionic-native/local-notifications';

/**
 * Generated class for the AddEventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-event',
  templateUrl: 'add-event.html',
})
export class AddEventPage {
  event = { title: "", startTime: new Date().toISOString(), endTime: new Date().toISOString(), allDay: false, startLocation: "", isTTEnabled: false, meetingLocation: "", travelTime: "None", travelDistance: "", alert: 5 };
  minDate = new Date().toISOString();

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public modalCtrl: ModalController, public viewCtrl: ViewController, public eventServiceProvider: EventServiceProvider, public localNotifications: LocalNotifications) {
    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    this.event.startTime = preselectedDate;
    this.event.endTime = preselectedDate;
    this.minDate = preselectedDate;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddEventPage');
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
  save() {

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
            eventName: this.event.title,
            startTime: startTimeSQL,
            endTime: endTimeSQL,
            isAllDay: this.event.allDay,
            isTTEnabled: this.event.isTTEnabled,
            startLocation: this.event.startLocation,
            meetingLocation: this.event.meetingLocation,
            travelTime: this.event.travelTime,
            travelDistance: this.event.travelDistance
          };
          if (this.event.isTTEnabled) {
            this.eventServiceProvider.eventConstraints(startTimeSQL, this.event.travelTime).subscribe(
              data => {
                this.eventServiceProvider.createEvent(body).subscribe(
                  data => {
                    //update home page 
                    var prevPage = this.navParams.get('prevPage');
                    this.eventServiceProvider.getAllEventDay().subscribe(data => {
                      prevPage.eventList = data.data;
                      prevPage.eventSource = prevPage.getEvents();
                    });
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
                        this.eventServiceProvider.createEvent(body).subscribe(
                          data => {
                            //update home page 
                            var prevPage = this.navParams.get('prevPage');
                            this.eventServiceProvider.getAllEventDay().subscribe(data => {
                              prevPage.eventList = data.data;
                              prevPage.eventSource = prevPage.getEvents();
                            });
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
            this.eventServiceProvider.createEvent(body).subscribe(
              data => {
                //update home page 
                var prevPage = this.navParams.get('prevPage');
                this.eventServiceProvider.getAllEventDay().subscribe(data => {
                  prevPage.eventList = data.data;
                  prevPage.eventSource = prevPage.getEvents();
                });
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
  //Funcation For Calcuation of TT
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
