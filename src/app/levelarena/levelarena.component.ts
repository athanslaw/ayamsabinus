import { Component, OnInit } from '@angular/core';
import { WordsService } from '../words.service';
import { Word } from '../interfaces/Word';
import { Storage } from '@ionic/storage';
// import { fstat } from 'fs';
import * as $ from 'jquery';
import { gsap, TimelineLite, TimelineMax, TweenMax, Back, Power1 } from 'gsap';
import { AppRate } from '@ionic-native/app-rate/ngx';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SoundService } from '../sound.service';
import { JaraService } from '../jara.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-levelarena',
  templateUrl: './levelarena.component.html',
  styleUrls: ['./levelarena.component.scss'],
})
export class LevelarenaComponent implements OnInit {

  params:any;
  multiArray:any[] = [];
  words:any;

  totalRanks: number;
  levelWords: any[];
  levelLength: number;
  levelMarker:number = 0;
  rank:number;
  rankData: any;
  level:number;
  totalLevels:number;


  currentWord:Word = {word:'', meaning:''};
  currentWordSplit:string[];

  lastLetterInt:number;

  wordArray:any[] = [];


  compact: any[] = [];
  compactShuffled:any[]= [];


  selectedLetters:any[] = [];

  sticker: string;

  rowToBounce:number = 0;


  jaraWords:any;

  jaraPlayed:any[];

  jaraPercent:string;

  jaraFull:number;

  jaraKomkom:number;



  // profile variables

  score:number;
  cowries:number;
  userid:string;

  settingsVisible:boolean = false;

  toastMessage:string="";

  soundStat:boolean = true;
  sfxStat:boolean = true;

  constructor(
    private wordsService: WordsService,
    private storage: Storage,
    private appRate: AppRate,
    private route: ActivatedRoute,
    private router: Router,
    private soundService: SoundService,
    private jaraService: JaraService,
    private toastController: ToastController
  ) { }

  async ngOnInit() {

    this.soundStat = this.soundService.getSoundStat();
    this.sfxStat = this.soundService.getSfxStat();

    this.route.params.subscribe(params => {
      this.params = params;
      console.log(this.params);
    });

    await this.fetchProfile();

    this.fetchWords();


    $(".settings").fadeOut(500);

    var tl = gsap.timeline();
    tl.to(".fadeOne", {opacity: 1, duration: 1});
    tl.to(".fadeTwo", {opacity: 1, duration: 1},'-=0.5');

    this.jaraPercent = this.jaraService.jaraPercent() + '%';
    this.jaraFull = this.jaraService.getJaraFull();
    this.jaraKomkom = this.jaraService.getKomkom();

  }





  async fetchWords(){

    // console.log(this.level);
    // console.log(this.levelMarker);

    this.multiArray = [];

    this.wordsService.fetchWords()
    .subscribe(
      (data) => {
        this.words = data;
        this.rankData = this.words[this.params.rank];
        // console.log(this.params.rank);
        // this.totalRanks = this.words.length;
        // this.totalLevels = this.rankData.levels.length;
        this.levelWords = this.rankData.levels[this.params.level]['WORDS'];

        this.currentWord = this.levelWords[this.params.word];

        this.currentWordSplit = this.split(this.currentWord.word);
        this.wordArray = this.splitWords(this.currentWord.word);

        this.setupCompact();
        this.lastLetterInt = this.currentWordSplit.length - 1;


        this.fetchJaraWords();


      }
    );

}


split(str){
  var res = str.split("");
  return res;
}


splitWords(str){
  var res = str.split(" ");
  return res;
}

setupCompact(){
  this.wordArray.forEach((word)=>{

    let compact = [];

    let splitArr = this.split(word);
      splitArr.forEach((item,index)=>{
        compact.push({
          letter: item,
          visible: false,
          selected: false,
          hint: false,
          idCode: this.create_UUID()
        })
      });


      this.multiArray.push(compact);

    })



    this.compactShuffle();
    // console.log(this.compact);

}




compactShuffle(){
  this.compactShuffled = this.shuffle([].concat(...this.multiArray));
  this.bubble();
}


bubble(){

  $(".bubble1").fadeIn(800).fadeOut(2000);

  setTimeout(() => {
    $(".bubble2").fadeIn(700).fadeOut(2000);
  }, 1000);

  setTimeout(() => {
    $(".bubble3").fadeIn(900).fadeOut(1500);
  }, 1500);

  setTimeout(() => {
    $(".bubble4").fadeIn(800).fadeOut(2000);
  }, 2000);

  setTimeout(() => {
    $(".bubble5").fadeIn(700).fadeOut(2500);
  }, 2500);

}





selectLetter(id,fullObj,i){

  // console.log(fullObj);

  let check = this.checkIfHasBeenSelected(fullObj) ? true :false;

  if (check) {
    return;
  }


  this.selectedLetters.push(this.compactShuffled[i]);
  this.compactShuffled[i].selected = true;

  this.checkForJara();


}






submitTray(){

  //remove jara shake incase it's still there
  $(".jara").removeClass('animate__shakeY');

  let wordString = [];
  let matchFound = false;
  //wordposition is the array position of the matched word in the multi array
  let wordPosition;

  for (let i = 0; i < this.selectedLetters.length; i++) {
   wordString.push(this.selectedLetters[i].letter);
  }



  for (let j = 0; j < this.wordArray.length; j++) {

      const w = this.wordArray[j];

      //check for match in word array and simultaneously check compact version in multiarray to see if word has already been chosen
      if (w == wordString.join("") && this.multiArray[j][0].visible == false) {
          matchFound = true;
          wordPosition = j;
          break;
      }

  }


  if (matchFound) {
    // console.log("match found");
    this.rowToBounce = wordPosition;
    this.rightSelections(wordPosition);
  }else{
    this.wrongSelections();
  }


}

cancelSubmitTray(){

    this.compactShuffled.forEach((item,index)=>{
      if (this.arrayContainsObject(item, this.selectedLetters) ) {
        item.selected = false;
      }
    })

    this.selectedLetters = [];

    $(".jara").removeClass('animate__shakeY');


}









wrongSelections(){

  $(".selectedTray").addClass("animate__wobble");

  setTimeout(() => {

      this.compactShuffled.forEach((item,index)=>{
        if (this.arrayContainsObject(item, this.selectedLetters) ) {
          item.selected = false;
        }
      })


      $(".selectedTray").removeClass("animate__wobble");
      this.selectedLetters = [];

      this.randomSticker("negative");

  }, 1500);


}





rightSelections(wordPosition){

  // console.log(this.multiArray[wordPosition]);

  for (let i = 0; i < this.multiArray[wordPosition].length; i++) {

    this.multiArray[wordPosition][i].visible = true;

  }

  $(".wordRack").addClass("animate__bounce");

  // this.cowries += 3;
  // this.storage.set('cowries', this.cowries);

  //remove bounce class from previous success
  setTimeout(() => {
      $(".wordRack").removeClass("animate__bounce");
  }, 2000);

  this.selectedLetters = [];

  this.roundStatus();

}




roundStatus(){


  //check if all words are completed and go to next round

  if (this.checkIfRoundComplete()) {

            this.randomSticker("positive");

            setTimeout(() => {
              this.router.navigate(['/level']);
            }, 3000);

  }






}



checkIfRoundComplete(){

  let completed = true;


  //flatten multiarray to allow looping through
  let flatArray = [].concat(...this.multiArray)

  for (let i = 0; i < flatArray.length; i++) {
    const letter = flatArray[i];

    if (!letter.visible) {
      completed = false;
    }

  }


 return completed;

}



revealRandom(){

  //get random from multi dimensional array
  var random1 = Math.floor((Math.random() * (this.multiArray.length)));
  var random2 = Math.floor((Math.random() * (this.multiArray[random1].length)))
  return this.multiArray[random1][random2];

}

giraffe(){

  //check if player has coins then deduct coins per click

  if (this.cowries > 10) {

    this.cowries -= 10;
    this.storage.set('cowries', this.cowries);

  }else{
    this.toast("ya cowrie no reach. Make you try buy");
    return;
  }

  let r = this.revealRandom();

  if (!r.hint && r.letter!==" ") {

    r.hint = true;

  }else{
    this.giraffe();
  }


}


revealRandom2(){

  //get random from multi dimensional array (first level only)
  var random1 = Math.floor((Math.random() * (this.multiArray.length)));
  return this.multiArray[random1];

}



juju(){



  let r = this.revealRandom2().slice(0, 3);

  let atLeastOneNotVisible = r.filter((l)=>{ return l.visible == false && l.hint == false  });

  if (atLeastOneNotVisible.length > 0) {


      if (this.cowries > 20) {

        this.cowries -= 20;
        this.storage.set('cowries', this.cowries);
        r.forEach(l => {
          l.hint = true;
        });

      }else{
        this.toast("ya cowrie no reach. Make you try buy");
        return;
      }

  }else{
    this.juju();
  }



}




fetchJaraWords(){

  this.wordsService.fetchJaraWords()
  .subscribe(
    (data) => {
      this.jaraWords = data;

    }
  );

}



checkForJara(){

  let activeWord = [];
  this.selectedLetters.forEach((letter,index)=>{ activeWord.push(letter.letter) });

  let match = [];

  this.jaraWords.filter((word,index)=>{

    if ((activeWord.join("").toLowerCase() == word.toLowerCase()) && !this.jaraNotUsed(word)) {
          match.push(word);
    }else{
          $(".jara").removeClass('animate__shakeY');
    }

  });


  if (match.length > 0) {
    this.jaraService.saveJaraFound(1);
    $(".jara").addClass('animate__shakeY');

  }


};

jaraNotUsed(word){
  let played = this.jaraPlayed.includes(word);
  return played;
}




activateJara(){

  if (this.jaraService.getJaraFound() < 1) {
    this.toast("you must find jara word first");
    return;
  }

  // this.cowries +=10;
  // this.storage.set('cowries', this.cowries);

  let activeWord = [];

  this.selectedLetters.forEach((letter,index)=>{ activeWord.push(letter.letter) });

  $(".jara").removeClass('animate__shakeY');

  this.jaraPlayed.push(activeWord.join("").toLowerCase() );

  this.storage.set('jaraPlayed', this.jaraPlayed);

  this.jaraService.addJara(10);
  this.jaraService.reduceJaraFound(1);

  $(".jaraPane").fadeIn();

  let newPercent = this.jaraService.jaraPercent() + '%';

  this.jaraFull = this.jaraService.getJaraFull();
  this.jaraKomkom = this.jaraService.getKomkom();

  setTimeout(() => {
    $(".jaraProg").animate({width: newPercent});
  }, 1000);

  setTimeout(() => {
    this.jaraPercent = newPercent;
  }, 3000);

  this.toast("Wehdone! You done collect Jara");

}


takeAm(){
  this.soundService.playCowrieSound();
  this.closeJara();
  this.jaraService.resetKomkom();
  this.cowries += 50;
  this.storage.set('cowries', this.cowries);
}




closeJara(){
  $(".jaraPane").fadeOut();
}





dictionary(){
  $(".dictionary").fadeIn();
}


closeDictionary(){
  $(".dictionary").fadeOut();
}








toggleSettings(){

  if (!this.settingsVisible) {
    $(".settings").fadeIn(500);
    this.settingsVisible = !this.settingsVisible;
  }else{
    $(".settings").fadeOut(500);
    this.settingsVisible = !this.settingsVisible;
  }

}














//utility function

checkIfHasBeenSelected(obj){
  return this.arrayContainsObject(obj,this.selectedLetters)
}



arrayContainsObject(obj, array) {
  var i;
  for (i = 0; i < array.length; i++) {
      if (array[i] === obj) {
          // console.log("already selected");
          return true;
      }
  }

  // console.log("not been selected");
  return false;

}


create_UUID(){
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}


shuffle(array) {
  let copy = [...array];
  return copy.sort(() => Math.random() - 0.5);
}

getDegree(i){

  // let random = Math.floor(Math.random() * 20) + 1;
  let deg = i*30+15;
  return `rotate(${deg}deg)`;

}


randomSticker(PosOrNeg){

  this.sticker = PosOrNeg == "positive" ? `../../assets/stickers/positive/${Math.floor(Math.random() * 34) + 1}.png` : `../../assets/stickers/negative/${Math.floor(Math.random() * 20) + 1}.png`;
  this.animateSticker();

}


animateSticker(){
  var tl = gsap.timeline();
  tl.to(".sticker", {ease: "elastic.out(1, 0.3)", width: "80vw", left: "10vw", duration: 2.5});
  tl.to(".sticker", { width: "0vw", left: "50vw", duration: 0.5});
}



returnFont(l){

  return l!==' '? `../../assets/alphabets/${l.toLowerCase()}.png` : '';

}


getRandomInbetween(min, max) {

}


spin(i){
   return i == 0 ? 15 : i * 8;
  // return i * 20;
}






async fetchProfile(){

  await this.storage.get('score').then((val) => {
    this.score =  val;
  });

  await this.storage.get('rank').then((val) => {
    this.rank = val;
    // console.log(this.level);
  });

  await this.storage.get('level').then((val) => {
    this.level = val;
    // console.log(this.level);
  });


  await this.storage.get('levelMarker').then((val) => {
    this.levelMarker =  val;
  });

  await this.storage.get('userid').then((val) => {
    this.userid = val;
  });

  await this.storage.get('cowries').then((val) => {
    this.cowries = val;
  });


  this.storage.get('jaraPlayed').then((val) => {
    this.jaraPlayed = !val || val == null ? [] : val;
    this.storage.set('jaraPlayed', this.jaraPlayed);
  });

}




toast(tm){

  this.toastMessage = tm;
  $(".toast").fadeIn();
  setTimeout(() => {
    $(".toast").fadeOut();
  }, 3000);
  setTimeout(() => {
    this.toastMessage = "";
  }, 4000);

}


nextRank() {}

toggleSound() {
  this.soundStat = !this.soundStat;
  this.soundService.toggleSound(this.soundStat);
}

toggleSfx() {
  this.sfxStat = !this.sfxStat;
  this.soundService.toggleSfx(this.sfxStat);
}

rate() {
  // set certain preferences
  this.appRate.preferences.storeAppURL = {
    // ios: '<app_id>',
    android: 'market://details?id=io.sabinus.app',
    // windows: 'ms-windows-store://review/?ProductId=<store_id>'
  }
  this.appRate.promptForRating(true);
}

toast_error(tm){
  this.toastController.create({
      message: tm,
      position: 'bottom',
      cssClass: 'toast-error-class',
      duration: 4000,
      buttons: [ {
          side: 'start',
          text: '|',
          role: 'cancel'
        },{
            side: 'end',
            icon: 'information-circle',
          }
      ]
    }).then((toast) => {
      toast.present();
    });
}

toast_success(tm){
  this.toastController.create({
      message: tm,
      position: 'bottom',
      cssClass: 'toast-success-class',
      duration: 4000,
      buttons: [ {
          side: 'start',
          text: '|',
          role: 'cancel'
        },{
            side: 'end',
            icon: 'checkmark-circle'
          }
      ]
    }).then((toast) => {
      toast.present();
    });
}



}
