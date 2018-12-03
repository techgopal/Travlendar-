import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { LunchBreakPage } from '../pages/lunch-break/lunch-break';
import { TransPrefPage } from '../pages/trans-pref/trans-pref';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { RegistrationPage } from '../pages/registration/registration';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';

import { AddEventPage } from '../pages/add-event/add-event';
import { EventDetailsPage } from '../pages/event-details/event-details';


import { NgCalendarModule  } from 'ionic2-calendar';
import { MapServiceProvider } from '../providers/map-service/map-service';
import { EventServiceProvider } from '../providers/event-service/event-service';

import { LocalNotifications } from '@ionic-native/local-notifications';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegistrationPage,
    AddEventPage,
    EventDetailsPage,
    ProfilePage,
    LunchBreakPage,
    TransPrefPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgCalendarModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegistrationPage,
    AddEventPage,
    EventDetailsPage,
    ProfilePage,
    LunchBreakPage,
    TransPrefPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    MapServiceProvider,
    EventServiceProvider,
    LocalNotifications
  ]
})
export class AppModule {}
