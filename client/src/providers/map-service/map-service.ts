import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
/*
  Generated class for the MapServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MapServiceProvider {
  token:any;
  constructor(public http: HttpClient) {
    this.token = localStorage.getItem('token');
  }

  getPlaceSearch(input):Observable<any>{
    return this.http.get('/api/maps/locationSuggestion?input='+input+'&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjIwLCJ1c2VybmFtZSI6IjEyMyIsInBhc3N3b3JkIjoiJDJhJDEwJG1tdVNQam8wb1FIOGZlTHRyV0pEMWVmTlNqR0kzNmJtNTFFYkxkaUVSY2JrUC5qN1JyeUouIiwiaWF0IjoxNTEzNDI5NjkyfQ.2aTWIccll1FTb9M3SnDfxWI-LuVVNQpoytoHThp6tj4');
  }
  getTimeDistance(startLocation,endLocation):Observable<any>{
    return this.http.get('/api/maps/calculateDistTime?startLocation='+startLocation+'&endLocation='+endLocation+'&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjIwLCJ1c2VybmFtZSI6IjEyMyIsInBhc3N3b3JkIjoiJDJhJDEwJG1tdVNQam8wb1FIOGZlTHRyV0pEMWVmTlNqR0kzNmJtNTFFYkxkaUVSY2JrUC5qN1JyeUouIiwiaWF0IjoxNTEzNDI5NjkyfQ.2aTWIccll1FTb9M3SnDfxWI-LuVVNQpoytoHThp6tj4');
  }
  getDirection(startLocation,endLocation,mode):Observable<any>{
    return this.http.get('/api/maps/directions?startLocation='+startLocation+'&endLocation='+endLocation+'&mode='+mode+'&token='+this.token);
  }
  getDirectionTmode(startLocation,endLocation,mode,tmode):Observable<any>{
    return this.http.get('/api/maps/directions?startLocation='+startLocation+'&endLocation='+endLocation+'&mode='+mode+'&tmode='+tmode+'&token='+this.token);
  }
}
