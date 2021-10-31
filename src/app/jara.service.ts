import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})

export class JaraService {

  private jaraKomkom:number;
  private jaraFound:number=0;
  private jaraFull:number = 100

  constructor(
    private storage: Storage,
  ) { 

    this.storage.get('jaraKomkom').then((val) => {
      // this.jaraKomkom = 0;
      this.jaraKomkom = !val || val == null ? 0 : val;
      this.storage.set('jaraKomkom', this.jaraKomkom);
    });
    this.storage.get('jaraFound').then((val) => {
      // this.jaraFound = 0;
      this.jaraFound = !val || val == null ? 0 : val;
      this.storage.set('jaraFound', this.jaraFound);
    });

  }

  getKomkom(){
    return this.jaraKomkom;
  }

  getJaraFull(){
    return this.jaraFull;
  }

  resetKomkom(){
    this.jaraKomkom = 0;
    this.storage.set('jaraKomkom', 0);
  }


  getJaraFound(){
    return this.jaraFound;
  }

  saveJaraFound(n){
    this.jaraFound += n;
    this.storage.set('jaraFound', this.jaraFound);
  }

  reduceJaraFound(n){
    if(this.jaraFound < 1) return;
    this.jaraFound -= n;
    this.storage.set('jaraFound', this.jaraFound);
  }

  addJara(n){
    if(this.jaraKomkom > this.jaraFull){ return; };
    this.jaraKomkom += n;
    this.storage.set('jaraKomkom', this.jaraKomkom);
  }


  jaraPercent(){
    return (this.jaraKomkom/this.jaraFull)* 100;
  }

}
