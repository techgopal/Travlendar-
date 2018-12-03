import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { LunchBreakPage } from '../pages/lunch-break/lunch-break';
import { TransPrefPage } from '../pages/trans-pref/trans-pref';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Profile', component: ProfilePage },
      { title: 'Lunch Break', component: LunchBreakPage },
      { title: 'Transit Preference', component: TransPrefPage },
      { title: 'Logout', component: null }
    ];

    this.rootPage = LoginPage;

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component) {
      this.nav.setRoot(page.component);
    } else {
      localStorage.removeItem("token");
      this.nav.setRoot(LoginPage);
    }
  }
}
