import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the EventServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EventServiceProvider {
  token;
  constructor(public http: HttpClient) {
    this.token = localStorage.getItem('token');
    //console.log(this.token);
  }
  createEvent(body) {
    return this.http.post('/api/event/create?token=' + this.token, body);
  }
  deleteEvent(eventId) {
    return this.http.get('/api/event/delete?eventId='+eventId+'&token=' + this.token);
  }
  eventConstraints(startTime,travelTime) : any{
    return this.http.get('/api/event/timeconstraint?startTime='+startTime+'&travelTime='+travelTime+'&token='+this.token);
  }
  updateEvent(body) {
    //console.log(body);
    return this.http.post('/api/event/update?token=' + this.token, body);
  }
  getAllEventDay(): any {
    return this.http.get('/api/event/all?token=' + this.token);
  }
  getEventLocation(eventId): any {
    return this.http.get('/api/event/location?token=' + this.token + '&eventId=' + eventId);
  }
  addDefaultLunchEvents(userid) : any{
    return this.http.get('/api/event/break/newuser?userid='+userid);
  }
  getLunchBreak(startTime, endTime): any {
    //console.log(startTime + "-->" + endTime);
    return this.http.get('/api/event/break/update?token=' + this.token + '&startTime=' + startTime + "&endTime=" + endTime);
  }
}
