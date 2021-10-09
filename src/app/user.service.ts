import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // url = 'http://192.168.64.2/sabinus-api';
  // url = 'https://tobialagbe.com/sabinus';
  url = 'https://ayamsabinus.com/sabinus-api';

  constructor(
    private http: HttpClient
  ) { }


  registerUser(user){
    return this.http.post(this.url, user);
  }

  registerUsersJsonp(user){
    // alert(JSON.stringify(user));
    return this.http.get(`${this.url}/userdatajsonp.php?userid=${user.userid}&uname=${user.name}&email=${user.email}&img=${user.image}&score=${0}&cowries=${0}&tokens=${0}&giraffes=${0}&begibegi=${0}&juju=${0}`);

    // return this.http.jsonp(`${this.url}/userdatajsonp.php?userid=${user.userid}&uname=${user.name}&email=${user.email}&img=${user.image}&score=${0}&cowries=${0}&tokens=${0}&giraffes=${0}&begibegi=${0}&juju=${0}`, 'callback')
  }

  fetchUser(sid){
    // return this.http.post()
    return this.http.get(`${this.url}/fetchuserdata.php?sabinusid=${sid}`);
    // return this.http.jsonp(`${this.url}/fetchuserdata.php?sabinusid=${sid}`, 'callback')
  }

  findOpponent(sid){
    //  return this.http.jsonp(`${this.url}/findopponent.php?opponentid=${sid}`, 'callback')
    return this.http.get("https://ayamsabinus.com/sabinus-api/findopponent_extra.php?opponentid="+sid);

    // return this.http.post(`${this.url}/findopponent.php?opponentid=${sid}`, 'callback')
  }

  getNotifications(sid){
    return this.http.jsonp(`${this.url}/fetchnotifications.php?sabinusid=${sid}`, 'callback')
  }




  // registerUser(user){
  //   return this.http.post(this.url, user);
  // }
  //
  // registerUsersJsonp(user){
  //   // alert(JSON.stringify(user));
  //   return this.http.jsonp(`${this.url}/userdatajsonp.php?userid=${user.userid}&uname=${user.name}&email=${user.email}&img=${user.image}&score=${0}&cowries=${0}&tokens=${0}&giraffes=${0}&begibegi=${0}&juju=${0}`, 'callback')
  // }
  //
  // fetchUser(sid){
  //   return this.http.jsonp(`${this.url}/fetchuserdata.php?sabinusid=${sid}`, 'callback')
  // }
  //
  // findOpponent(sid){
  //   return this.http.jsonp(`${this.url}/findopponent.php?opponentid=${sid}`, 'callback')
  // }
  //
  // getNotifications(sid){
  //   return this.http.jsonp(`${this.url}/fetchnotifications.php?sabinusid=${sid}`, 'callback')
  // }

  markRead(nid){
    return this.http.jsonp(`${this.url}/markread.php?nid=${nid}`, 'callback')
  }

  logPlayerCowries(sid,cowries){
    // console.log(cowries);
    return this.http.jsonp(`${this.url}/updatecowries.php?sid=${sid}&cowries=${cowries}`, 'callback')
  }

  logPlayerCowriesProgressive(sid,cowries){
    console.log(cowries);
    return this.http.jsonp(`${this.url}/updatecowries.php?sid=${sid}&cowries=${cowries}`, 'callback')
  }

  logPlayerPerks(sid,juju,giraffes,begibegi,tokens){
    console.log("sid:::",sid," juju:::",juju," giraffes:::",giraffes," begibegi:::",begibegi," tokens:::",tokens);
    return this.http.jsonp(`${this.url}/updateperks.php?sid=${sid}&juju=${juju}&giraffes=${giraffes}&begibegi=${begibegi}&tokens=${tokens}`, 'callback')
  }

  setPlayerPerks(sid,juju,giraffes,begibegi,tokens){
    return this.http.jsonp(`${this.url}/setperks.php?sid=${sid}&juju=${juju}&giraffes=${giraffes}&begibegi=${begibegi}&tokens=${tokens}`, 'callback')
  }

  getPaystackLink(sid,amount,tag){
    return this.http.jsonp(`${this.url}/paystack.php?sid=${sid}&amount=${amount}&callback_url=${this.url}/callback.php?sid=${sid}splitter${tag}`, 'callback')
  }

  logVideoChecks(sid,video){
    return this.http.jsonp(`${this.url}/updatevideochecks.php?sid=${sid}&video=${video}`, 'callback')
  }

}
