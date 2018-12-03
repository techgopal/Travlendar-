import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';

import { JwtHelper } from 'angular2-jwt';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  token: any;
  jwtHelper: JwtHelper = new JwtHelper();
  regData: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public authServiceProvider: AuthServiceProvider, public alertCtrl: AlertController, public viewCtrl: ViewController) {
    this.token = localStorage.getItem('token');
    this.regData = this.jwtHelper.decodeToken(this.token);
    this.regData.password = "";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
  update() {
    this.authServiceProvider.updateUser(this.regData).subscribe(
      data => {
        let alert = this.alertCtrl.create({
          title: 'Update',
          subTitle: 'Update Succesful.',
          buttons: ['OK']
        });
        alert.present();
      },
      error => {
        let alert = this.alertCtrl.create({
          title: 'Updation Error',
          subTitle: 'Please Try Again',
          buttons: ['OK']
        });
        alert.present();
      }
    );
  }
}
