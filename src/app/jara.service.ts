import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})

export class JaraService {

  private jaraKomkom:number;
  private jaraFull:number = 100

  constructor(
    private storage: Storage,
  ) { 

    this.storage.get('jaraKomkom').then((val) => {
      // this.jaraKomkom = 0;
      this.jaraKomkom = !val || val == null ? 0 : val;
      this.storage.set('jaraKomkom', this.jaraKomkom);
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


  addJara(n){
    if(this.jaraKomkom > this.jaraFull){ return; };
    this.jaraKomkom += n;
    this.storage.set('jaraKomkom', this.jaraKomkom);
  }


  jaraPercent(){
    return (this.jaraKomkom/this.jaraFull)* 100;
  }








}
