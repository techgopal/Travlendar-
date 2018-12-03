import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController,MenuController} from 'ionic-angular';

import { RegistrationPage } from '../registration/registration';
import { HomePage } from '../home/home';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginData = { username:'', password:'' };
  loading: any;
  data:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public authServiceProvider: AuthServiceProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController,private menuCtrl: MenuController) {
  }
  //TO DISABLE SIDEMENU 
  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(true);
   }
  
  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: 'Authenticating...'
    });
    this.loading.present();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  register() {
    this.navCtrl.push(RegistrationPage);
  }

  doLogin(){
    var validateForm = false;
    if (this.loginData.username == "") {
      let alert = this.alertCtrl.create({
        title: 'Invalid Username',
        subTitle: 'Please Provide Correct Username',
        buttons: ['OK']
      });
      alert.present();

    } else {
      if (this.loginData.password == "") {
        let alert = this.alertCtrl.create({
          title: 'Invalid Password',
          subTitle: 'Please Provide Correct Password',
          buttons: ['OK']
        });
        alert.present();
      } else {
        validateForm = true;
      }
    }
    if(validateForm){
      this.showLoader();
      
      this.authServiceProvider.authUser(this.loginData).subscribe(
        data => {
          this.loading.dismiss();
          console.log(data);
          if(data.isValidUser){
            localStorage.setItem('token', data.token);
            this.navCtrl.setRoot(HomePage);
            console.log('CC');
          }else{
            let alert = this.alertCtrl.create({
              title: 'Login Error',
              subTitle: 'Please Provide Correct Credentials',
              buttons: ['OK']
            });
            alert.present();
          }
        },
        error => {
          this.loading.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Login Error',
            subTitle: 'Please Provide Correct Credentials',
            buttons: ['OK']
          });
          alert.present();
        }
      );
    }
  }//doLoginEnd
}
