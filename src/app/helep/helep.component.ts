import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Location } from '@angular/common';

@Component({
  selector: 'app-helep',
  templateUrl: './helep.component.html',
  styleUrls: ['./helep.component.scss'],
})
export class HelepComponent implements OnInit {

  howToImage: string = "../../assets/landingpage/howtoplay/pot.png";
  howToXter: string = "../../assets/landingpage/howtoplay/helper1.png";
  howToText: string = "Tap the letters make you form the correct pidgin word(s). How many you fit find?";
  howToPane: number = 1;

  padiImage: string = "../../assets/landingpage/howtoplay/pot.png";
  padiText: string = "";
  padiPane: number = 1;
  playlikePane: number = 1;
  jaraPane: number = 1;

  padiImage2: string = "../../assets/helep/padiplay/intro.png";

  jaraImage: string = ".../../assets/helep/jarawords/popup.png";

  showpre = false;
  shownex = true;

  padiPrevImg: string = "";
  padiNextImg: string = "";

  howToText1: any;

  jaraPaneLay: number;


  constructor(private storage: Storage, private ngxService: NgxUiLoaderService, 
    private router: Router,
    private _location: Location) { 
      
    // console.log("how to pane", this.howToPane);
    if(this.howToPane == 1) {
      this.padiNextImg = "../../assets/landingpage/howtoplay/next.png";
    }
  }

  ngOnInit() { 
    $(".howToPane").fadeOut();
    $(".jaraPane").fadeOut();
    $(".padiplayPane").fadeOut();
  }


  howToClose() {
    $(".howToPane").fadeOut();
  }


  // howToNext() {
  //   if (this.howToPane < 2) {
  //     this.howToPane++;
  //     this.analyseHowToPane(this.howToPane);
  //     // this.storage.set('howTo', true);
  //   }
  // }
  // howToPrev() {
  //   if (this.howToPane > 1) {
  //     this.howToPane--;
  //     this.analyseHowToPane(this.howToPane);
  //   }
  // }
  // analyseHowToPane(howToPane) {
  //   if (howToPane == 1) {
  //     this.howToImage = "../../assets/landingpage/howtoplay/pot.png";
  //     this.howToText = "Tap the letters make you form the correct pidgin word(s). How many you fit find?";
  //     this.howToXter = "../../assets/landingpage/howtoplay/helper1.png";
  //   } else if (howToPane == 2) {
  //     this.howToImage = "../../assets/landingpage/howtoplay/instruction.png";
  //     this.howToText = "You dey scratch ya head for ansa? Begi Begi, Giraffing and Juju dey for you";
  //     this.howToXter = "../../assets/landingpage/howtoplay/helper2.png";
  //   }

  // }


  jaraClose() {
    $(".jaraPane").fadeOut();
  }


  showPlayLikeDis() {
    $(".howToPane").fadeIn();
  }

  showJara() {
    $(".jaraPane").fadeIn();

  }

  showPadi() {
    $(".padiplayPane").fadeIn();
  }

  padiClose() {
    $(".padiplayPane").fadeOut();
  }

  jaraPrev() {
    if (this.jaraPane < 2) {
      this.jaraPane++;
      this.analyseJaraPane(this.jaraPane);
    }
  }
  jaraNext() {
    if (this.jaraPane == 1) {
      this.jaraPane--;
      this.analyseJaraPane(this.jaraPane);
    }
  }
  analyseJaraPane(howToPane) {
      if (howToPane == 1) {
        this.jaraImage = "../../assets/helep/jarawords/popup.png";
        this.padiPrevImg = null;
        this.padiNextImg = "../../assets/landingpage/howtoplay/next.png";
        this.padiText = null;
      } else if (howToPane < 1) {
        this.jaraImage = "../../assets/helep/jarawords/popup2.png";
        this.padiPrevImg = "../../assets/landingpage/howtoplay/prev.png";
        this.padiNextImg = null;
        this.padiText = null;
      } 
      console.log("jara layout: ", this.jaraPaneLay);
  }


  playlikePrev() {
    if (this.playlikePane < 2) {
      this.playlikePane++;
      this.analysePlaylikePane(this.playlikePane);
    }
  }
  playlikeNext() {
    if (this.playlikePane == 1) {
      this.playlikePane--;
      this.analysePlaylikePane(this.playlikePane);
    }
  }
  analysePlaylikePane(howToPane) {
      if (howToPane == 1) {
        this.howToImage = "../../assets/landingpage/howtoplay/pot.png";
        this.padiPrevImg = null;
        this.padiNextImg = "../../assets/landingpage/howtoplay/next.png";
        this.padiText = null;
      } else if (howToPane < 1) {
        this.howToImage = "../../assets/landingpage/howtoplay/instruction.png";
        this.padiPrevImg = "../../assets/landingpage/howtoplay/prev.png";
        this.howToText1 = "You dey scratch ya head for ansa?"
        this.howToText = "Begi Begi, Giraffing and Juju dey for you";
        this.padiNextImg = null;
        this.padiText = null;
      } 
    
  }


  padiNext() {
    if (this.padiPane < 4) {
      this.padiPane++;
      this.analysePadiPane2(this.padiPane);
    }
  }
  padiPrev() {
    if (this.padiPane > 1) {
      this.padiPane--;
      this.analysePadiPane2(this.padiPane);
    }
  }
  analysePadiPane2(howToPane) {
    if (howToPane == 1) {
      this.padiImage2 = "../../assets/helep/padiplay/intro.png";
      this.padiPrevImg = null;
      this.padiNextImg = "../../assets/landingpage/howtoplay/next.png";
      this.padiText = null;
    } else if (howToPane == 2) {
      this.padiImage2 = "../../assets/helep/padiplay/makewebegin.png";
      this.padiPrevImg = "../../assets/landingpage/howtoplay/prev.png";
      this.padiNextImg = "../../assets/landingpage/howtoplay/next.png";
      this.padiText = null;
    } else if (howToPane == 3) {
      this.padiImage2 = "../../assets/helep/padiplay/edonhard.png";
      this.padiPrevImg = "../../assets/landingpage/howtoplay/prev.png";
      this.padiNextImg = "../../assets/landingpage/howtoplay/next.png";
      this.padiText = null;
    } else if (howToPane == 4) {
      this.padiImage2 = "../../assets/helep/padiplay/end.png";
      this.padiPrevImg = "../../assets/landingpage/howtoplay/prev.png";
      this.padiNextImg = null;
      // this.padiText = null;
      // this.padiText = "TO JOIN YA PADI DEM, YOU GO NEED 1 TOKEN. YOU FIT BUY TOKEN FOR SHOP OR TRY YA LUCK WIT TUMBUM";
      this.padiText = null;
    }
  }

  back() {
    
    $(".howToPane").fadeOut();
    $(".jaraPane").fadeOut();
    $(".padiplayPane").fadeOut();

    this._location.back();
  }



}
