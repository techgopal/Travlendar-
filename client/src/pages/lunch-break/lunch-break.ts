import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';

import * as moment from 'moment';
import { EventServiceProvider } from '../../providers/event-service/event-service';

@IonicPage()
@Component({
  selector: 'page-lunch-break',
  templateUrl: 'lunch-break.html',
})
export class LunchBreakPage {
  lunchBreakTime = { startTime: new Date().toISOString(), endTime: new Date().toISOString() }
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public eventServiceProvider: EventServiceProvider, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LunchBreakPage');
  }

  save() {
    var a = this.lunchBreakTime.endTime;
    var b = this.lunchBreakTime.startTime;
    console.log("a-->"+a);
    var diff = moment(a).diff(moment(b), 'minutes');

    if (diff >= 30) {
      this.eventServiceProvider.getLunchBreak(moment(b).format("HH:mm"), moment(a).format("HH:mm")).subscribe(
        data => {
          let alert = this.alertCtrl.create({
            title: 'Success',
            subTitle: "Default LunchBreak is Updated",
            buttons: ['OK']
          })
          alert.present();
          //this.viewCtrl.dismiss();
        },
        error => {
          //Unreachnable in time
          //todo: Write code warning box based on its input read forward
          console.log(error);
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: error.error.errormsg,
            buttons: ['OK']
          })
          alert.present();
        }
      );

    } else {
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: "Minumum Lunch Break Is 30Mins",
        buttons: ['OK']
      })
      alert.present();
    }
    console.log("CONSOLE ->" + diff);

  }
}
