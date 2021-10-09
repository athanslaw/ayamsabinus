import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WordsService {

  wordsUrl = 'assets/data/combined.json';
  jaraWordsUrl = 'assets/data/jarawords.json';
  url = 'https://ayamsabinus.com/sabinus-api';

  constructor(
    private http: HttpClient
  ) {}
  
  fetchWords(){
    return this.http.get(this.wordsUrl);
  }

  fetchJaraWords(){
    return this.http.get(this.jaraWordsUrl);
  }

  createPadiplay(uid,gid){
    return this.http.jsonp(`${this.url}/creategame.php?uid=${uid}&gid=${gid}`, 'callback');
  }

  joinPadiplay(gameid){
    return this.http.jsonp(`${this.url}/joingame.php?gameid=${gameid}`, 'callback');
  }

  submitScore(payload){
    //padiplayscore
    return this.http.jsonp(`${this.url}/submitscore.php?gameid=${payload.gameid}&score=${payload.score}&gametime=${payload.gametime}&role=${payload.playerrole}&challenger=${payload.challenger}&opponent=${payload.opponent}`, 'callback');
  }

}
