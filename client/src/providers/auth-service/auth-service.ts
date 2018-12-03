import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {
  token: any;
  constructor(public http: HttpClient) {
    console.log('Hello AuthServiceProvider Provider');
    this.token = localStorage.getItem('token');
  }
  createUser(body): any {
    return this.http.post('/api/user/register', body);
  }
  updateUser(body): any {
    console.log(this.token);
    return this.http.post('/api/user/update?token=' + this.token, body);
  }
  getUserTransitPref(): any {
    return this.http.get('/api/user/transpref?token=' + this.token);
  }
  updateUserTransitPref(bus,subway,train,tram,rail): any {
    return this.http.get('/api/user/update/transpref?bus='+bus+'&subway='+subway+'&train='+train+'&tram='+tram+'&rail='+rail+'&token=' + this.token);
  }
  authUser(body): any {
    return this.http.post('/api/user/auth', body);
  }
}
