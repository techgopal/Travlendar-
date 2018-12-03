import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';

import { AddEventPage } from '../add-event/add-event';
import { EventDetailsPage } from '../event-details/event-details';

import * as moment from 'moment';

import { EventServiceProvider } from '../../providers/event-service/event-service';
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    eventSource;
    viewTitle;
    view;
    selectedDay = new Date();
    isToday: boolean;
    loading: any;
    eventList: any;
    //calendar
    calendar = {
        mode: 'month',
        currentDate: new Date(),
        dateFormatter: {
            formatMonthViewDay: function (date: Date) {
                return date.getDate().toString();
            },
            formatMonthViewDayHeader: function (date: Date) {
                return 'MonMH';
            },
            formatMonthViewTitle: function (date: Date) {
                return 'testMT';
            },
            formatWeekViewDayHeader: function (date: Date) {
                return 'MonWH';
            },
            formatWeekViewTitle: function (date: Date) {
                return 'testWT';
            },
            formatWeekViewHourColumn: function (date: Date) {
                return 'testWH';
            },
            formatDayViewHourColumn: function (date: Date) {
                return 'testDH';
            },
            formatDayViewTitle: function (date: Date) {
                return 'testDT';
            }
        }
    };

    //constructor 
    constructor(public navCtrl: NavController, public eventServiceProvider: EventServiceProvider, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
        this.view = "month";
        this.showLoader();
        this.eventServiceProvider.getAllEventDay().subscribe(data => {
            this.eventList = data.data;
            this.eventSource = this.getEvents();
            console.log(this.eventSource);
            this.loading.dismiss();
        });
    }

    showLoader() {
        this.loading = this.loadingCtrl.create({
            content: 'Loading...'
        });
        this.loading.present();
    }

    onViewTitleChanged(title) {
        this.viewTitle = title;
    }

    onEventSelected(event) {
        this.eventServiceProvider.getEventLocation(event.id).subscribe(data => {
            //console.log(data.data);
            this.navCtrl.push(EventDetailsPage, { event: event, location: data.data, prevPage: this });
        });

        console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
    }

    today() {
        this.calendar.currentDate = new Date();
    }

    onTimeSelected(ev) {
        this.selectedDay = ev.selectedTime;
    }

    onCurrentDateChanged(event: Date) {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        event.setHours(0, 0, 0, 0);
        this.isToday = today.getTime() === event.getTime();
    }

    getEvents() {
        var events = [];
        if (this.eventList != undefined) {
            //console.log('Have ' + this.eventList.length);
            for (var i = 0; i < this.eventList.length; i++) {
                // console.log("Event Name --> " + eventList[i].eventname);
                var allDay = true;
                if (this.eventList[i].isallday == 0) {
                    allDay = false;
                }
                events.push(
                    {
                        id: this.eventList[i].eventid,
                        title: this.eventList[i].eventname,
                        startTime: new Date(this.eventList[i].startTime),
                        endTime: new Date(this.eventList[i].endTime),
                        allDay: allDay
                    });
            }
        }//end if
        return events;
    }

    onRangeChanged(ev) {
        console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
    }

    markDisabled = (date: Date) => {
        var current = new Date();
        current.setHours(0, 0, 0);
        return date < current;
    };

    addEvent() {
        // console.log(this.selectedDay);
        var sday = moment(this.selectedDay).format('YYYY-MM-DD');
        var tday = moment(new Date()).format('YYYY-MM-DD');
        if (sday >= tday) {
            this.navCtrl.push(AddEventPage, { selectedDay: this.selectedDay, prevPage: this });
        } else {
            console.log("SELECTED DAy");
            let alert = this.alertCtrl.create({
                title: 'Invalid Date',
                subTitle: "Please Select Correct Date",
                buttons: ['OK']
            })
            alert.present();
        }

    }
}
