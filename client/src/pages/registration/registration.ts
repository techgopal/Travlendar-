import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, MenuController } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { EventServiceProvider } from '../../providers/event-service/event-service';
/**
 * Generated class for the RegistrationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class RegistrationPage {
  regData = { name: '', username: '', password: '', email: '', mobno: '' };
  loading: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public authServiceProvider: AuthServiceProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController, private menuCtrl: MenuController, private eventServiceProvider: EventServiceProvider) {
  }
  //TO DISABLE SIDEMENU 
  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistrationPage');
  }

  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: 'Authenticating...'
    });
    this.loading.present();
  }

  doSignup() {
    var validateForm = false;
    if (this.regData.username == "") {
      let alert = this.alertCtrl.create({
        title: 'Invalid Username',
        subTitle: 'Please Provide Correct Username',
        buttons: ['OK']
      });
      alert.present();

    } else {
      if (this.regData.password == "") {
        let alert = this.alertCtrl.create({
          title: 'Invalid Password',
          subTitle: 'Please Provide Correct Password',
          buttons: ['OK']
        });
        alert.present();
      } else {
        if (this.regData.name == "") {
          let alert = this.alertCtrl.create({
            title: 'Invalid Name',
            subTitle: 'Please Provide Correct Name',
            buttons: ['OK']
          });
          alert.present();
        } else {
          if (this.regData.email == "") {
            let alert = this.alertCtrl.create({
              title: 'Invalid Email',
              subTitle: 'Please Provide Correct Email',
              buttons: ['OK']
            });
            alert.present();
          } else {
            if (this.regData.mobno == "") {
              let alert = this.alertCtrl.create({
                title: 'Invalid Mobile Number',
                subTitle: 'Please Provide Correct Mobile Number',
                buttons: ['OK']
              });
              alert.present();
            } else {
              validateForm = true;
            }
          }
        }
      }
    }
    if (validateForm) {
      this.showLoader();
      this.authServiceProvider.createUser(this.regData).subscribe(
        data => {
          console.log(data);
          this.eventServiceProvider.addDefaultLunchEvents(data.userId).subscribe(
            data => {
              this.loading.dismiss();
              let alert = this.alertCtrl.create({
                title: 'Registration',
                subTitle: 'Registration Succesful. Please Login',
                buttons: ['OK']
              });
              alert.present();
              this.navCtrl.pop();
            })
        },
        error => {
          this.loading.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Registration Error',
            subTitle: 'Please Try Again',
            buttons: ['OK']
          });
          alert.present();
        }
      );
    }
  }
}
