import { Component, OnInit } from '@angular/core';
import { WordsService } from '../words.service';
import { Word } from '../interfaces/Word';
import { Storage } from '@ionic/storage';
// import { fstat } from 'fs';
import * as $ from 'jquery';
import { gsap, TimelineLite, TimelineMax, TweenMax, Back, Power1 } from 'gsap';
import { AppRate } from '@ionic-native/app-rate/ngx';
import { UserService } from '../user.service';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SoundService } from '../sound.service';
import { JaraService } from '../jara.service';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-padiplay',
  templateUrl: './padiplay.component.html',
  styleUrls: ['./padiplay.component.scss'],
})
export class PadiplayComponent implements OnInit {


  gamedata:any;
  // {"challengerId":"eb2bbjp","opponentId":"aa048tm"}

  gameid:any;

  sabinusId:any;

  loggedIn:number=1;

  loginMsg:any;

  gameStarted:boolean = false;

  timeElapsed:number = 60;

  timeElapsedSinceLastPlay = 0;
  timeElapsedSinceLastPlayHelp = 0;

  lastplayedTtimer:any;

  timer:any;

  shouldHelp:any;

  checkTimeUp:any;

  padiScore:number = 0;


  multiArray:any[] = [];
  words:any;

  totalRanks: number;
  levelWords: any[];
  levelLength: number;
  levelMarker:number = 0;
  rank:number = 1;
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

  padiplayResult:string = "";

  toastMessage:string="";

  jujuCount:number;
  girraffesCount:number;
  begibegiCount:number;

  soundStat:boolean = true;
  sfxStat:boolean = true;
  gamesplayed:number;

  constructor(
    private wordsService: WordsService,
    private storage: Storage,
    private appRate: AppRate,
    private fb: Facebook,
    private userService: UserService,
    private router: Router,
    public platform: Platform,
    private google: GooglePlus,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private soundService: SoundService,
    private jaraService: JaraService,
    private toastController: ToastController
  ) { }



  async ngOnInit() {


    this.loggedIn=1;
    await this.fetchProfile();

    await this.fetchRouteParams();

    // this.fetchWords();

    $(".settings").fadeOut(500);

    var tl = gsap.timeline();
    tl.to(".fadeOne", {opacity: 1, duration: 1});
    tl.to(".fadeTwo", {opacity: 1, duration: 1},'-=0.5');



    this.shouldHelp = setInterval(()=>{
      if (this.timeElapsedSinceLastPlayHelp > 20 && this.gameStarted) {
        $(".helpPane").fadeIn().css({display: "flex"});
      }
    },1000);

    this.checkTimeUp = setInterval(()=>{
      if (this.timeElapsed <= 0 && this.gameStarted) {
        //game over
        if (this.gamedata.role == "challenger") {
          $(".timeUpPane").fadeIn().css({display: "flex"});
        }else{
          this.ngxService.start();
        }
        clearInterval(this.timer);
        clearInterval(this.checkTimeUp);

        this.gameStarted = false;
        this.closeHelp();
        this.submitScore();
      }
    },1000);
    this.jaraPercent = this.jaraService.jaraPercent() + '%';
    this.jaraFull = this.jaraService.getJaraFull();
    this.jaraKomkom = this.jaraService.getKomkom();
    this.getPerkCount();


    this.platform.ready().then(() => {
      // prevent default back
      //if (Capacitor.platform === "android") {
        document.addEventListener("backbutton", function(event){
          event.preventDefault();
          this.router.navigate(['/landing']);
        }, false);
      //}

    })

  }

  async fetchRouteParams(){
    await this.route.params.subscribe(params => {
      this.gamedata = JSON.parse(params.gamedata);
      // console.log(this.gamedata);
      this.ngxService.start();
      if (this.gamedata.role == "challenger") {
        this.fetchWords();
        // alert("challenger");
      }else{
        this.joinGame();
        // alert("joining game");
      }
    });
  }

  async fetchWords(){
    console.log(this.level);
    console.log(this.levelMarker);
    this.multiArray = [];
    this.wordsService.createPadiplay(this.gamedata.challengerId,this.gamedata.opponentId).subscribe((data) => {
        console.log(data['words']);
        this.gameid = data['gameid'];
        this.levelWords = data['words'];

        this.currentWord = this.levelWords[this.levelMarker];

        this.currentWordSplit = this.split(this.currentWord.word);
        this.wordArray = this.splitWords(this.currentWord.word);

        this.setupCompact();
        this.lastLetterInt = this.currentWordSplit.length - 1;

        this.startGame();

        //fetch in background while game has started
        this.fetchJaraWords();
        this.ngxService.stop();

      },
      //error callback
      (error)=>{
        this.ngxService.stop();
        $(".errorPane").fadeIn().css({display: "flex"});
        console.log(error);
      });
}


joinGame(){
  this.multiArray = [];
  this.wordsService.joinPadiplay(this.gamedata.gameId).subscribe((data) => {

      this.ngxService.stop();
      if(data['data'] ==''){
        this.toast('No vex, anoda padi don play dis game');
        setTimeout(() => {
          this.router.navigate(['/landing']);
        }, 3500);
        
      }else{
        console.log(data['words']);

        this.gameid = data['gameid'];
        this.levelWords = data['words'];


        //this.currentWord = this.levelWords[1];
        this.currentWord = this.levelWords[this.levelMarker];

        this.currentWordSplit = this.split(this.currentWord.word);
        this.wordArray = this.splitWords(this.currentWord.word);

        this.setupCompact();
        this.lastLetterInt = this.currentWordSplit.length - 1;

        this.startGame();

        //fetch in background while game has started
        this.fetchJaraWords();
      }

    },
    //error callback
    (error)=>{
      this.ngxService.stop();
      $(".errorPane").fadeIn().css({display: "flex"});
      console.log(error);
    }
  );

}

startGame(){

  this.gameStarted = true;
  this.startTimer();
  this.startLastPlayedCounter();
}


closeHelp(){
  this.timeElapsedSinceLastPlay = 0;
  this.timeElapsedSinceLastPlayHelp = 0;
  $(".helpPane").fadeOut();
  clearInterval(this.shouldHelp);
}


closeTimeUp(){
  $(".timeUpPane").fadeOut();
  this.router.navigate(['/landing']);
}


closeErrorPane(){
  $(".errorPane").fadeOut();
  this.router.navigate(['/landing']);
}


nextWord(){
  this.multiArray = [];
  this.currentWord = this.levelWords[this.levelMarker];

  this.currentWordSplit = this.split(this.currentWord.word);
  this.wordArray = this.splitWords(this.currentWord.word);

  this.setupCompact();
  this.lastLetterInt = this.currentWordSplit.length - 1;

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
  this.bubble();
  this.compactShuffled = this.shuffle([].concat(...this.multiArray));
  // REMOVE VISIBLE BOARD ELEMENTS FROM POT
  
  this.compactShuffled = this.compactShuffled.filter((i)=>{
    return i.letter !== '?'
  });
  
  setTimeout(() => {
    this.squeezeLetters();
  }, 200);
}

bubble(){
  // $(".bubble1").fadeIn(800).fadeOut(2000);

  // setTimeout(() => {
  //   $(".bubble2").fadeIn(700).fadeOut(2000);
  // }, 1000);

  // setTimeout(() => {
  //   $(".bubble3").fadeIn(900).fadeOut(1500);
  // }, 1500);

  // setTimeout(() => {
  //   $(".bubble4").fadeIn(800).fadeOut(2000);
  // }, 2000);

  // setTimeout(() => {
  //   $(".bubble5").fadeIn(700).fadeOut(2500);
  // }, 2500);

  var imgURL = "../../assets/game/bubble.gif";
  var timestamp = new Date().getTime();
  var bubbleGif = <HTMLImageElement>document.getElementById("bubble");
  var queryString = "?t=" + timestamp;
  bubbleGif.src = imgURL + queryString;
}

squeezeLetters(){
  var tls = gsap.timeline();
  tls.to(".pl", {opacity: 0, duration: 0.5});
  tls.to(".pl", {ease: "circ.out", opacity: 1, delay:2, duration: 0.8});
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

  this.timeElapsedSinceLastPlayHelp = 0;
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
/*
  if(this.wordArray.length >1){
    let wordsCombined = "";
    for (let k = 0; k < this.wordArray.length; k++) {
      wordsCombined += ""+this.wordArray[k];
    }
    if(wordsCombined == wordString){
      matchFound = true;
      wordPosition = j;
      break;
    }
  }
  */


  let w = [];
  for (let j = 0; j < this.wordArray.length; j++) {
    w.push(this.wordArray[j]);
    //check for match in word array and simultaneously check compact version in multiarray to see if word has already been chosen
    
    if (w.join("") == wordString.join("") && this.multiArray[j][0].visible == false) {
      matchFound = true;
      wordPosition = j;
      break;
    }

  }

  // if it's greater than 0 index join all and check at once

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
      // this.randomSticker("negative");
  }, 1500);
}

rightSelections(wordPosition){
  // console.log(this.multiArray[wordPosition]);
  
  for(let j=0; j <= wordPosition; j++){
    for (let i = 0; i < this.multiArray[j].length; i++) {
      this.multiArray[j][i].visible = true;
    }
  }

  $(".wordRack").addClass("animate__bounce");
  this.timeElapsedSinceLastPlay = 0;
  this.timeElapsedSinceLastPlayHelp = 0;
  clearInterval(this.lastplayedTtimer);
  this.startLastPlayedCounter();

  this.padiScore += 5;

  //remove bounce class from previous success
  setTimeout(() => {
      $(".wordRack").removeClass("animate__bounce");
  }, 2000);
  this.selectedLetters = [];
  this.roundStatus();
}

roundStatus(){
  //check if all words are completed
  if (this.checkIfRoundComplete()) {
      // this.randomSticker("positive");
      // 'levelmarker is less than lenth of words in current level'
      if (this.levelMarker+1 < this.levelWords.length) {
          //go to next word
          this.levelMarker+=1;
          setTimeout(() => {
            this.nextWord();
          }, 1500);
      } else {
        // 'current level is less than length of levels in rank'
        this.ngxService.start();
        this.storage.set('gameEndTime', this.timeElapsed);

        clearInterval(this.timer);
        clearInterval(this.checkTimeUp);

        this.gameStarted = false;
        this.closeHelp();
        // alert("padiplay over");
        this.submitScore();
      }
  }
}


// if (this.gamedata.role == "challenger")

submitScore(){
  let payload = {
    gameid: this.gameid,
    score: this.padiScore,
    gametime: this.timeElapsed,
    playerrole: this.gamedata.role,
    challenger: this.gamedata.challengerId,
    opponent: this.gamedata.opponentId
  }

  this.wordsService.submitScore(payload).subscribe((data) => {

      this.ngxService.stop();

      if (this.gamedata.role == "opponent") {
            if (data["winstat"] == "won") {
              // console.log("got here");
              this.padiplayResult = "won";

              this.storage.get('begibegi').then((val) => {
                let begibegi = !val || val == null ? 1 : parseInt(val)+1;
                this.storage.set('begibegi', begibegi);
              });
        
              this.storage.get('giraffes').then((val) => {
                let giraffes = !val || val == null ? 1 : parseInt(val)+1;
                this.storage.set('giraffes', giraffes);
              });
        
              this.storage.get('cowries').then((val) => {
                let cowries = !val || val == null ? 1200 : parseInt(val)+1200;
                this.storage.set('cowries', cowries);
                this.cowries = cowries;
              });
        
              this.storage.get('juju').then((val) => {
                let juju = !val || val == null ? 1 : parseInt(val)+1;
                this.storage.set('juju', juju);
              });
        
              this.storage.get('tokens').then((val) => {
                  let tokens = !val || val == null ? 2 : parseInt(val)+2;
                  this.storage.set('tokens', tokens);
              });

              $(".padiplayResult").fadeIn().css({display:"flex"});
              $(".resultImage").fadeIn();
              $(".resultImage").addClass("animate__tada");
            } else if (data["winstat"] == "lost") {
              // console.log("got here 2");
              this.padiplayResult = "lost";
              $(".padiplayResult").fadeIn().css({display:"flex"});
              $(".resultImage").fadeIn();
              $(".resultImage").addClass("animate__tada");
            } else {
              // console.log("got here 2");
              this.storage.get('tokens').then((val) => {
                let tokens = !val || val == null ? 1 : parseInt(val)+1;
                this.storage.set('tokens', tokens);
              });

              this.padiplayResult = "draw";
              $(".padiplayResult").fadeIn().css({display:"flex"});
              $(".resultImage").fadeIn();
              $(".resultImage").addClass("animate__tada");
            }
      } else {
        //if challenger
        $(".timeUpPane").fadeIn().css({display: "flex"});

      }
      this.fetchProfileRemote(this.sabinusId);
    },
    //error callback
    (error)=>{
      this.ngxService.stop();
      $(".errorPane").fadeIn().css({display: "flex"});
      console.log(error);
    }
  );

}

fetchProfileRemote(sid){
  this.userService.fetchUser(sid).subscribe((res) => {
    this.storage.set('gamesplayed', Number(res["user"][0]["gamesplayed"]));
    this.storage.set('gameswon', Number(res["user"][0]["gameswon"]));
    this.storage.set('gameslost', Number(res["user"][0]["gameslost"]));
    this.storage.set('totalscore', Number(res["user"][0]["totalscore"]));
    this.storage.set('winstreak', Number(res["user"][0]["winstreak"]));
    this.storage.set('longestwinstreak', Number(res["user"][0]["longestwinstreak"]));
    this.storage.set('averagescore', Number(res["user"][0]["averagescore"]));
    this.storage.set('highestscore', Number(res["user"][0]["highestscore"]));
  });
}

closeResult(){
    $(".resultImage").fadeOut();
    $(".padiplayResult").fadeOut();
    $(".resultImage").removeClass("animate__tada");
    this.router.navigate(['/landing']);
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
  console.log("//check if player has coins then deduct coins per click",this.girraffesCount);
  if (this.girraffesCount >= 1) {
    this.timeElapsedSinceLastPlayHelp=0;
//:val giraffe deduction should be by 1
    this.girraffesCount -= 1;
    this.storage.set('giraffes', this.girraffesCount);
    this.getPerkCount();

  }else{
    this.toast("Ya giraffe no reach. Make you try buy");
    return;
  }

  let r = this.revealRandom();

  if (!r.hint && r.letter!==" ") {

    r.hint = true;
    this.soundService.playSelectSound();

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

  // let rnd = [1,2,3,4,5,6,7,8,9];

  // console.log(this.shuffle(rnd).slice(0,4));

  let r = this.shuffle(this.revealRandom2()).slice(0,4);

  let atLeastOneNotVisible = r.filter((l)=>{ return l.visible == false && l.hint == false  });

  if (atLeastOneNotVisible.length > 0) {
    console.log("//check if player has coins then deduct coins per click",this.jujuCount);
      if (this.jujuCount >= 1) {
        this.timeElapsedSinceLastPlayHelp=0;
        this.jujuCount -= 1;
        this.storage.set('juju', this.jujuCount);
        r.forEach(l => {
          l.hint = true;
        });
        this.getPerkCount();

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

  if (this.jaraService.getJaraFound() <1) {
    this.toast("you must find jara word first");
    return;
  }

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

begibegi(){
  this.timeElapsedSinceLastPlayHelp=0;
  $(".begibegiPane").fadeIn().css({display: "flex"});
}

closeBegibegi(){
  $(".begibegiPane").fadeOut()
}

selectBegibegiHole(letter, letterIndex, rowIndex){
    if (this.begibegiCount >= 1 || this.cowries >= 30) {
      this.multiArray[rowIndex][letterIndex].hint = true;
      
      if(this.begibegiCount >= 1){
        this.begibegiCount -= 1;
        console.log("begibegipoint", this.begibegiCount)
        this.storage.set('begibegi', Number(this.begibegiCount));
      }
      else{
        this.cowries -= 30;
        this.storage.set('cowries', Number(this.cowries));
      }
    } else {
      this.toast("Ya cowrie no reach. Make you try buy");
    }
    setTimeout(() => {
      this.closeBegibegi();
    }, 500);
}

dictionary(){
  $(".dictionary").fadeIn();
}


closeDictionary(){
  $(".dictionary").fadeOut();
}


startTimer(){

  this.timer = setInterval(()=>{
    this.timeElapsed -= 1;
  },1000);


}


startLastPlayedCounter(){
   this.lastplayedTtimer = setInterval(()=>{
    this.timeElapsedSinceLastPlay +=1;
    this.timeElapsedSinceLastPlayHelp +=1;
  },1000);
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

  this.storage.get('sabinusid').then((val) => {

    if (!val) {
      this.loggedIn = 0;
      this.loginMsg = "Save ya hard work make you fit play on top any device!";
    }else{
      this.loggedIn = 1;
      this.sabinusId = val;
      this.loginMsg="";
    }

  });

  await this.storage.get('score').then((val) => {
    this.score =  val;
  });

  await this.storage.get('userid').then((val) => {
    this.userid = val;
  });

  await this.storage.get('cowries').then((val) => {
    this.cowries = val;
  });

  await this.storage.get('jaraPlayed').then((val) => {
    this.jaraPlayed = !val || val == null ? [] : val;
    this.storage.set('jaraPlayed', this.jaraPlayed);
  });

}


rate(){
  // set certain preferences
this.appRate.preferences.storeAppURL = {
  // ios: '<app_id>',
  android: 'market://details?id=io.sabinus.app',
  // windows: 'ms-windows-store://review/?ProductId=<store_id>'
}

this.appRate.promptForRating(true);
}


//social login stuff

loginGoogle(){
  this.platform.ready().then(() => {
    this.google.login({})
    .then((res) => {

      $(".fbPane").fadeOut();
      console.log(res);
      // alert(JSON.stringify(res));
      this.storage.set('userid', res.id);

      let user = {
        userid: res.userId,
        name: res.displayName,
        email: res.email,
        image: res.imageUrl,
      }

      this.saveUser(user);
      this.loginMsg="";
      this.loggedIn = 1;
    })
    .catch((err) => {
      console.log(err);
      // alert("error: "+JSON.stringify(err));
      this.loggedIn = 0;
    });
  })

}


getFbStatus(){

  this.fb.getLoginStatus()
  .then(res => {
    $(".fbPane").fadeOut();
    console.log(res.status);
    if (res.status === 'connect') {
      this.loginMsg="";
      this.loggedIn = 1;
    } else {
      this.loggedIn = 0;
      this.fbLogin();
    }
  })
  .catch((e) => {
    console.log(e);
  });

}


fbLogin() {

  $(".fbPane").fadeOut();

  this.fb.login(['public_profile', 'email'])
    .then(res => {
      if (res.status === 'connected') {
        $(".fbPane").fadeOut();
        this.loggedIn = 1;
        this.loginMsg="";
        this.getUserDetail(res.authResponse.userID);
      } else {
        this.loggedIn = 0;
      }
    })
    .catch((e) => {
      console.log('Error logging into Facebook', e);
    });
}


getUserDetail(userid: any) {
  this.fb.api('/' + userid + '/?fields=id,email,name,picture', ['public_profile'])
    .then(res => {
      console.log(res);
      $(".fbPane").fadeOut();
      // alert(JSON.stringify(this.users));
      this.storage.set('userid', res.id);

      let user = {
        userid: res.id,
        name: res.name,
        email: res.email,
        image: res.picture.data.url,
      }

      this.saveUser(user);

    })
    .catch(e => {
      console.log(e);
    });
}


saveUser(user){

  // alert("got here");

  let usertest = {
    userid: "010201",
    name: "Test User",
    email: "test2@email.com",
    image: "na",
  }



  this.userService.registerUsersJsonp(usertest)
  .subscribe((res) => {
    // console.log(res["user"][0]["sabinusid"]);
    this.sabinusId = res["user"][0]["sabinusid"];
    this.storage.set('sabinusid', res["user"][0]["sabinusid"]);
  });


}


getPerkCount(){

  this.storage.get('juju').then((val) => {
    this.jujuCount = !val || val == null ? 0 : val;
  });


  this.storage.get('giraffes').then((val) => {
    this.girraffesCount = !val || val == null ? 0 : val;
  });

  this.storage.get('begibegi').then((val) => {
    this.begibegiCount = !val || val == null ? 0 : val;
  });

}


// fb
logout() {
  this.fb.logout()
    .then( res => this.loggedIn = 0)
    .catch(e => console.log('Error logout from Facebook', e));
}


closeFbPane(){
  $(".fbPane").fadeOut();
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


toggleSound() {
  this.soundStat = !this.soundStat;
  this.soundService.toggleSound(this.soundStat);
}

toggleSfx() {
  this.sfxStat = !this.sfxStat;
  this.soundService.toggleSfx(this.sfxStat);
}


}
