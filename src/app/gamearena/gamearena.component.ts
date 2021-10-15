import { Component, OnInit } from '@angular/core';
import { WordsService } from '../words.service';
import { Word } from '../interfaces/Word';
import { Storage } from '@ionic/storage';
// import { fstat } from 'fs';
import * as $ from 'jquery';
import { gsap, TimelineLite, TimelineMax, TweenMax, Back, Power1 } from 'gsap';
import { AppRate } from '@ionic-native/app-rate/ngx';
import { SoundService } from '../sound.service';
import { UserService } from '../user.service';
import { JaraService } from '../jara.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';

import { BackgroundMode } from '@ionic-native/background-mode/ngx/';

@Component({
  selector: 'app-gamearena',
  templateUrl: './gamearena.component.html',
  styleUrls: ['./gamearena.component.scss'],
})
export class GamearenaComponent implements OnInit {

  multiArray: any[] = [];
  words: any;

  totalRanks: number;
  levelWords: any[];
  levelLength: number;
  levelMarker: number = 0;
  rank: number = 1;
  rankData: any;
  level: number;
  totalLevels: number;


  currentWord: Word = { word: '', meaning: '' };
  currentWordSplit: string[];

  countLetterScore: number;

  lastLetterInt: number;

  wordArray: any[] = [];


  compact: any[] = [];
  compactShuffled: any[] = [];


  selectedLetters: any[] = [];

  sticker: string;

  rowToBounce: number = 0;

  jaraWords: any;

  jaraPlayed: any[];

  canJara: boolean = false;

  jaraPercent: string;

  jaraFull: number;

  jaraKomkom: number;


  // profile variables

  score: number;
  cowries: number;
  userid: string;

  videoclicks: number;


  settingsVisible: boolean = false;

  toastMessage: string = "";

  soundStat: boolean = true;
  sfxStat: boolean = true;

  jujuCount: number;
  girraffesCount: number;
  begibegiCount: number;

  isLoggedIn = false;
  isBubble = 0;
  
  sabinusId:any;

  rankName = ["Johny Just Come", "I DEY COUNT BRIDGE", "SMALLIE", "JUNIOR SABINUS"]
  rankDef: any;

  constructor(
    private wordsService: WordsService,
    private storage: Storage,
    private appRate: AppRate,
    private soundService: SoundService,
    private jaraService: JaraService,
    private userService: UserService,
    private backgroundMode: BackgroundMode,
    private router: Router,
    private toastController: ToastController
  ) { }

  async ngOnInit() {

    // this.storage.set('cowries', 200);

    this.soundStat = this.soundService.getSoundStat();
    this.sfxStat = this.soundService.getSfxStat();

    await this.fetchProfile();
    this.fetchWords();
    $(".settings").fadeOut(500);

    var tl = gsap.timeline();
    tl.to(".fadeOne", { opacity: 1, duration: 1 });
    tl.to(".fadeTwo", { opacity: 1, duration: 1 }, '-=0.5');

    this.jaraPercent = this.jaraService.jaraPercent() + '%';
    this.jaraFull = this.jaraService.getJaraFull();
    this.jaraKomkom = this.jaraService.getKomkom();

    await this.getPerkCount();

    await this.storage.get('sabinusid').then((val) => {
      if (!val) {
        this.isLoggedIn = false;
      } else {
        this.isLoggedIn = true;
        this.sabinusId = val;
        // retrieve and log video clicks
        this.storage.get('videoclicks').then((valc) => {
          this.videoclicks = parseInt(valc);
          this.storage.set('videoclicks', this.videoclicks);
        });
        this.userService.logVideoChecks(this.sabinusId, this.videoclicks);
      }
    });
//background mode for sound service
//     this.backgroundMode.enable();
//     this.backgroundMode.on("activate").subscribe(()=>{
//       this.soundService.stopThemeSong();
//     });

  }


  async fetchWords() {

    this.multiArray = [];

    this.wordsService.fetchWords().subscribe((data) => {
          this.words = data;
          this.rankData = this.words[this.rank - 1];
          this.totalRanks = this.words.length;

          this.totalLevels = this.rankData.levels.length;
          this.levelWords = this.rankData.levels[this.level - 1]['WORDS'];

          this.currentWord = this.levelWords[this.levelMarker];

          this.currentWordSplit = this.split(this.currentWord.word);
          this.wordArray = this.splitWords(this.currentWord.word);

          this.countLetterScore = this.countLetters(this.currentWord.word);

          this.setupCompact();
          this.lastLetterInt = this.currentWordSplit.length - 1;

          this.fetchJaraWords();
    });

  }

  split(str) {
    var res = str.split("");
    return res;
  }

  splitWords(str) {
    var res = str.split(" ");
    return res;
  }

  countLetters(str) {
    let letterCount = str.replace(/\s+/g, '').length;
    return letterCount;
  }

  setupCompact() {

    let randomVisibleWordPosition;

    if (this.wordArray.length > 2) {
      // Between 0 and max
      randomVisibleWordPosition = Math.floor(Math.random() * (this.wordArray.length));
    }

    this.wordArray.forEach((word, wordIndex) => {

      let compact = [];

      let splitArr = this.split(word);
      splitArr.forEach((item, index) => {
        compact.push({
          letter: item,
          //make question marks and one random word (for sets with more than 2 words) visible on the board
          visible: item == '?' || wordIndex == randomVisibleWordPosition ? true : false,
          selected: false,
          hint: false,
          idCode: this.create_UUID()
        })
      });

      this.multiArray.push(compact);

    })

    this.compactShuffle();

  }


  compactShuffle() {

    $(".pl").css({ opacity: 0 });

    this.compactShuffled = this.shuffle([].concat(...this.multiArray));
    
    this.compactShuffled = this.compactShuffled.filter((i) => {
      return !i.visible;
    })

    setTimeout(() => {
      this.squeezeLetters();
    }, 200);

    setTimeout(() => {this.isBubble=1},1000);
  }

  compactShuffleDirect() {
    this.bubble();
    $(".pl").css({ opacity: 0 });

    this.compactShuffled = this.shuffle([].concat(...this.multiArray));
    
    this.compactShuffled = this.compactShuffled.filter((i) => {
      return !i.visible;
    })

    setTimeout(() => {
      this.squeezeLetters();
    }, 200);

    setTimeout(() => {this.isBubble=1},1000);
  }


  // added by kanmi
  sparkle_correct() {
    $(".sparkle").css({ display: "block" });
    this.soundService.playCorrectSound();
    setTimeout(() => {
      $(".sparkle").fadeOut();
    }, 2000);
  }


  sparkle() {
    $(".sparkle").css({ display: "block" });
    this.soundService.playGlitterSound();
    setTimeout(() => {
      $(".sparkle").fadeOut();
    }, 2000);
  }

  sparkle2() {
    $(".sparkle2").css({ display: "block" });
    this.soundService.playGlitterSound();
    setTimeout(() => {
      $(".sparkle2").fadeOut();
    }, 2000);
  }


  bubble() {

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

    var imgURL = "../../assets/game/bubble1.gif";
    var timestamp = new Date().getTime();
    var bubbleGif = <HTMLImageElement>document.getElementById("bubble");
    var queryString = "?t=" + timestamp;
    bubbleGif.src = imgURL + queryString;
  }



  squeezeLetters() {
    var tls = gsap.timeline();
    tls.to(".pl", { opacity: 0, duration: 0.5 });
    tls.to(".pl", { ease: "circ.out", opacity: 1, delay: 2, duration: 0.8 });
  }

  selectLetter(id, fullObj, i) {
    let check = this.checkIfHasBeenSelected(fullObj) ? true : false;

    if (check) {
      return;
    }
    this.selectedLetters.push(this.compactShuffled[i]);
    this.compactShuffled[i].selected = true;

    this.checkForJara();

    this.soundService.playSelectSound();
  }

  submitTray() {


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
       console.log("match found");
      this.rowToBounce = wordPosition;
      this.rightSelections(wordPosition);

    } else {
      this.wrongSelections();
    }
  }

  cancelSubmitTray() {

    this.compactShuffled.forEach((item, index) => {
      if (this.arrayContainsObject(item, this.selectedLetters)) {
        item.selected = false;
      }
    })

    this.selectedLetters = [];

    $(".jara").removeClass('animate__shakeY');

    this.soundService.playClearSound();
  }


  wrongSelections() {

    $(".selectedTray").addClass("animate__wobble");

    setTimeout(() => {

      this.compactShuffled.forEach((item, index) => {
        if (this.arrayContainsObject(item, this.selectedLetters)) {
          item.selected = false;
        }
      })


      $(".selectedTray").removeClass("animate__wobble");
      this.selectedLetters = [];

      this.randomSticker("negative");

    }, 1000);

    this.soundService.playErrorSound();
  }





  async rightSelections(wordPosition) {

    // console.log(this.multiArray[wordPosition]);

    this.sparkle_correct();
    // this.sparkle();

    for (let i = 0; i < this.multiArray[wordPosition].length; i++) {

      this.multiArray[wordPosition][i].visible = true;

    }

    $(".wordRack").addClass("animate__bounce");

    // this.cowries += 5;
    // this.storage.set('cowries', this.cowries);

    // this.score += 1;
    // this.storage.set('score', this.score);

    //remove bounce class from previous success
    await setTimeout(() => {
      $(".wordRack").removeClass("animate__bounce");
    }, 2000);

    this.selectedLetters = [];

    // this.roundStatus();
    await this.wehDone();

    this.soundService.playCowrieSound();

  }


  wehDone() {
    if (this.checkIfRoundComplete()) {
      this.randomSticker("positive");
      setTimeout(() => {
        $(".nextPane").fadeIn().css({ display: "flex" });
      }, 3000);
    }
  }



  roundStatus() {

    this.isBubble=0;
    this.animateCowries();

    let cowrie_count = Number(this.countLetterScore);

    // this.cowries += 10;
    this.cowries += cowrie_count;
    this.storage.set('cowries', Number(this.cowries));

    this.score += 1;
    this.storage.set('score', Number(this.score));


    //check if all words are completed and go to next round

    if (this.checkIfRoundComplete()) {

      $(".nextPane").fadeOut();
      this.bubble();
      // 'levelmarker is less than lenth of words in current level'
      if (this.levelMarker + 1 < this.levelWords.length) {

        //go to next word
        this.levelMarker += 1;
        this.storage.set('levelMarker', this.levelMarker);
        this.fetchWords();

      } else {
        // 'current level is less than length of levels in rank'
        if (this.level < this.totalLevels) {

          //go to next level
          this.level += 1;
          this.levelMarker = 0;
          this.storage.set('level', this.level);
          this.storage.set('levelMarker', this.levelMarker);
          this.fetchWords();

        } else {
          // if current rank is less than total ranks
          if (this.rank < this.totalRanks) {
            //go to next rank ...
            // this.nextRank();
            $(".levelsticker").fadeIn();

          } else {

            // reset ranks and levels
            this.rank = 1;
            this.level = 1;
            this.levelMarker = 0;
            this.storage.set('rank', this.rank);
            this.storage.set('level', this.level);
            this.storage.set('levelMarker', this.levelMarker);
            setTimeout(() => {
              this.fetchWords();
            }, 1500);
          }
        }
      }
    }
  }


  animateCowries() {

    var tlc = gsap.timeline();
    tlc.to(".fc1", { top: "3vh", left: "70vw", opacity: 1, duration: 0.6 });
    tlc.to(".fc2", { top: "3vh", left: "70vw", opacity: 1, duration: 0.6 }, '-=0.3');
    tlc.to(".fc3", { top: "3vh", left: "70vw", opacity: 1, duration: 0.6 }, '-=0.3');

    tlc.to(".fc1", { opacity: 0, duration: 0.1 });
    tlc.to(".fc2", { opacity: 0, duration: 0.1 }, '-=0.05');
    tlc.to(".fc3", { opacity: 0, duration: 0.1 }, '-=0.05');


    setTimeout(() => {
      tlc.to(".fc1", { top: "40vh", left: "40vw", duration: 0.1 });
      tlc.to(".fc2", { top: "40vh", left: "40vw", duration: 0.1 }, '-=0.1');
      tlc.to(".fc3", { top: "40vh", left: "40vw", duration: 0.1 }, '-=0.1');
    }, 4000);

  }

  // top: 40vh;
  // left: 40vw;

  nextRank() {
    this.rank += 1;
    this.level = 1;
    this.levelMarker = 0;
    this.storage.set('rank', this.rank);
    this.storage.set('level', this.level);
    this.storage.set('levelMarker', this.levelMarker);
    setTimeout(() => {
      this.fetchWords();
    }, 1500);
    $(".levelsticker").fadeOut();

  }



  checkIfRoundComplete() {

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



  revealRandom() {

    //get random from multi dimensional array
    var random1 = Math.floor((Math.random() * (this.multiArray.length)));
    var random2 = Math.floor((Math.random() * (this.multiArray[random1].length)))
    return this.multiArray[random1][random2];

  }


  /*


   giraffe() {
    //check if player has coins then deduct coins per click
    if (this.girraffesCount >3) {

      this.girraffesCount -= 3;
      this.storage.set('giraffes', Number(this.girraffesCount));
      this.getPerkCount();

    } else {
      this.toast("Ya giraffing no reach. Make you try buy");
      return;
    }

    this.sparkle();

    let r = this.revealRandom();

    if (!r.hint && r.letter !== " ") {

      r.hint = true;
      this.soundService.playSelectSound();

    } else {
      this.giraffe();
    }


  }
   */

  giraffe() {
    //check if player has coins then deduct coins per click
    if (this.girraffesCount >=1) {

      this.girraffesCount -= 1;
      this.storage.set('giraffes', Number(this.girraffesCount));
      this.getPerkCount();

    } else {
      this.toast("Ya giraffing no reach. Make you try buy");
      return;
    }

    this.sparkle();

    let r = this.revealRandom();

    if (!r.hint && r.letter !== " ") {

      r.hint = true;
      this.soundService.playSelectSound();

    } else {
      this.giraffe();
    }

  }


  revealRandom2() {

    //get random from multi dimensional array (first level only)
    var random1 = Math.floor((Math.random() * (this.multiArray.length)));
    return this.multiArray[random1];

  }



  juju() {
    // let rnd = [1,2,3,4,5,6,7,8,9];
    // console.log(this.shuffle(rnd).slice(0,4));
    let r = this.shuffle(this.revealRandom2()).slice(0, 4);

    let atLeastOneNotVisible = r.filter((l) => { return l.visible == false && l.hint == false });

    if (atLeastOneNotVisible.length > 0) {


      if (this.jujuCount >= 1) {
        this.sparkle2();
        this.jujuCount -= 1;
        this.storage.set('juju', this.jujuCount);
        r.forEach(l => {
          l.hint = true;
        });
        this.getPerkCount();

      } else {
        this.toast("Ya juju no reach. Make you try buy");
        return;
      }

    } else {
      this.juju();
    }

  }


  getRandomFromArray(arr, n) {
    var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
    if (n > len)
      // throw new RangeError("getRandom: more elements taken than available");
      while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
      }
    return result;
  }




  fetchJaraWords() {

    this.wordsService.fetchJaraWords()
      .subscribe(
        (data) => {
          this.jaraWords = data;

        }
      );

  }




  checkForJara() {

    let activeWord = [];
    this.selectedLetters.forEach((letter, index) => { activeWord.push(letter.letter) });

    let match = [];

    this.jaraWords.filter((word, index) => {

      if ((activeWord.join("").toLowerCase() == word.toLowerCase()) && !this.jaraNotUsed(word)) {
        match.push(word);
      } else {
        $(".jara").removeClass('animate__shakeY');
        this.canJara = false;
      }

    });


    if (match.length > 0) {
      this.canJara = true;
      $(".jara").addClass('animate__shakeY');

    }


  };


  jaraNotUsed(word) {
    let played = this.jaraPlayed.includes(word);
    return played;
  }


  activateJara() {

    if (!this.canJara) {
      this.toast("Ya jara no reach");
      return;
    }

    // this.cowries +=10;
    // this.storage.set('cowries', this.cowries);

    let activeWord = [];

    this.selectedLetters.forEach((letter, index) => { activeWord.push(letter.letter) });

    $(".jara").removeClass('animate__shakeY');

    this.jaraPlayed.push(activeWord.join("").toLowerCase());

    this.storage.set('jaraPlayed', this.jaraPlayed);

    this.jaraService.addJara(10);

    $(".jaraPane").fadeIn();

    let newPercent = this.jaraService.jaraPercent() + '%';

    this.jaraFull = this.jaraService.getJaraFull();
    this.jaraKomkom = this.jaraService.getKomkom();

    setTimeout(() => {
      $(".jaraProg").animate({ width: newPercent });
    }, 1000);

    setTimeout(() => {
      this.jaraPercent = newPercent;
    }, 3000);

    this.toast("Wehdone! You done collect Jara");
  }


  takeAm() {
    this.soundService.playCowrieSound();
    this.closeJara();
    this.jaraService.resetKomkom();
    this.cowries += 50;
    this.storage.set('cowries', Number(this.cowries));
  }



  closeJara() {
    $(".jaraPane").fadeOut();
  }


  begibegi() {
    $(".begibegiPane").fadeIn().css({ display: "flex" });
  }

  closeBegibegi() {
    $(".begibegiPane").fadeOut()
  }


  selectBegibegiHole(letter, letterIndex, rowIndex) {

    this.storage.get('begibegi').then((begibegi) => {
      var begibegi_point = !begibegi || begibegi == null ? 0 : Number(begibegi);
      if (begibegi_point >= 1) {
        this.multiArray[rowIndex][letterIndex].hint = true;
        // begibegi_point -= 150;
        // this.cowries = Number(begibegi_point);
        // this.storage.set('cowries', begibegi_point);
        //let begibegi = Number(this.getBegiBegiCount());
        console.log("correct begibegi: ", begibegi_point)
        begibegi -= 1;
        this.storage.set('begibegi', begibegi_point);
        this.getPerkCount();
        this.sparkle();
      } else {
        this.toast("Ya begi begi no reach. Make you try buy");
      }
      setTimeout(() => {
        this.closeBegibegi();
      }, 500);
    });

    // this.storage.get('begibegi').then((val) => {
    //   var begibegi = !val || val == null ? 0 : val;
    //   // console.log(begibegi);
    //   if (begibegi > 3) {
    //     this.multiArray[rowIndex][letterIndex].hint = true;
    //     begibegi -= 3;
    //     this.storage.set('begibegi', begibegi);
    //     this.getPerkCount();
    //     this.sparkle();
    //   } else {
    //     this.toast("Ya begi begi no reach. Make you try buy");
    //   }
    //   setTimeout(() => {
    //     this.closeBegibegi();
    //   }, 500);
    // });

  }

  getBegiBegiCount() {
      return this.storage.get('begibegi').then((val) => {
      return !val || val == null ? 0 : val;
    });
  }



  dictionary() {
    $(".dictionary").fadeIn();
  }


  closeDictionary() {
    $(".dictionary").fadeOut();
  }


  toggleSettings() {

    if (!this.settingsVisible) {
      $(".settings").fadeIn(500);
      this.settingsVisible = !this.settingsVisible;
    } else {
      $(".settings").fadeOut(500);
      this.settingsVisible = !this.settingsVisible;
    }

  }

  landing(){
    this.router.navigate(['/landing']);
  }



  //utility function

  checkIfHasBeenSelected(obj) {
    return this.arrayContainsObject(obj, this.selectedLetters)
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


  create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }


  shuffle(array) {
    let copy = [...array];
    return copy.sort(() => Math.random() - 0.5);
  }

  getDegree(i) {
    // let random = Math.floor(Math.random() * 20) + 1;
    let deg = i * 30 + 15;
    return `rotate(${deg}deg)`;
  }


  randomSticker(PosOrNeg) {
    // let pos = Math.floor(Math.random() * 34) + 1;
    // let neg = Math.floor(Math.random() * 20) + 1;

    let pos = Math.floor(Math.random() * 19) + 1;
    let neg = Math.floor(Math.random() * 20) + 1;
    // console.log("pos: ", pos)
    // console.log("neg: ", neg)
    this.sticker = PosOrNeg == "positive" ? `../../assets/stickers/positive/${pos}.png` : `../../assets/stickers/negative/${neg}.png`;
    if (PosOrNeg == "positive") {
      this.soundService.playPositiveStickerSound(pos);
    } else {
      if (neg > 13) {
        this.soundService.playNegativeStickerSound(14);
      } else {
        this.soundService.playNegativeStickerSound(neg);
      }
    }
    // setTimeout(this.animateSticker, 5000);
    this.animateSticker();
  }


  animateSticker() {
    var tl = gsap.timeline();
    tl.to(".sticker", { ease: "elastic.out(1, 0.3)", width: "80vw", left: "10vw", duration: 2.5 });
    tl.to(".sticker", { width: "0vw", left: "50vw", duration: 0.5 });
  }

  returnFont(l) {
    return l !== ' ' ? `../../assets/alphabets/${l.toLowerCase()}.png` : '';
  }


  getRandomInbetween(min, max) {
  }

  spin(i) {
    return i == 0 ? 15 : i * 8;
    // return i * 20;
  }


  async fetchProfile() {

    await this.storage.get('score').then((val) => {
      this.score = val;
    });

    await this.storage.get('rank').then((val) => {
      this.rank = val;
      this.getRankTitle(this.rank);
    });

    await this.storage.get('level').then((val) => {
      this.level = val;
      // alert("Your level: "+ val);
      // console.log(this.level);
    });


    await this.storage.get('levelMarker').then((val) => {
      this.levelMarker = val;
      // alert("Your level marker: "+ val);
    });

    await this.storage.get('userid').then((val) => {
      this.userid = val;
     // alert("Your userid: "+ val);
    });

    await this.storage.get('cowries').then((val) => {
      this.cowries = Number(val);
    });

    this.storage.get('jaraPlayed').then((val) => {
      this.jaraPlayed = !val || val == null ? [] : val;
      this.storage.set('jaraPlayed', this.jaraPlayed);
    });

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


  toast(tm) {

    this.toastMessage = tm;
    $(".toast").fadeIn();
    setTimeout(() => {
      $(".toast").fadeOut();
    }, 3000);
    setTimeout(() => {
      this.toastMessage = "";
    }, 4000);

  }

  toggleSound() {
    this.soundStat = !this.soundStat;
    this.soundService.toggleSound(this.soundStat);
  }

  toggleSfx() {
    this.sfxStat = !this.sfxStat;
    this.soundService.toggleSfx(this.sfxStat);
  }


  triggerVideo() {
    $(".videoPane").fadeIn().css({ display: 'flex' });
    this.startVideoTimer();
    this.storage.get('videoclicks').then((valc) => {
      this.videoclicks = !valc || valc == null ? 1 : Number(valc) + 1;
    });
    this.storage.set('videoclicks', this.videoclicks);
  }

  closeVideo() {
    $(".videoPane").fadeOut();
  }


  startVideoTimer() {

    $(".skip").css({ display: 'none' });
    $(".videoTime").fadeIn();

    let video = <HTMLVideoElement>document.getElementById("video");
    video.currentTime = 0;
    let vidSrc = <HTMLVideoElement>document.getElementById("vidSrc");
    const timer = document.getElementById("vtime");

    vidSrc.src = "https://ayamsabinus.com/sabinus-api/ads/ad.mp4";
    video.play();

    this.soundService.toggleSound(false);

    var vidInterval = setInterval(function () {

      if ((10 - Math.round(video.currentTime)) < 1) {
        $(".videoTime").fadeOut();
        setTimeout(() => {
          $(".skip").fadeIn().css({ display: "flex" });
          clearInterval(vidInterval);
        }, 1000);
        return;
      }
      // progress.innerHTML = Math.round((video.currentTime / video.duration) * 100);
      timer.innerHTML = 10 - Math.round(video.currentTime) + "";
    });
    // mine data for video click
    // if (this.sabinusId && this.sabinusId !== "") {
    //   this.userService.logVideoChecks(this.sabinusId,1);
    // }
  }

  skip() {
    let video = <HTMLVideoElement>document.getElementById("video");
    video.pause;
    video.currentTime = 0;
    this.soundService.toggleSound(true);
    this.closeVideo();
    this.reward();
  }


  reward() {
    this.animateCowries();
    this.toast("Ya reward na 30 cowries");
    this.soundService.playCowrieSound();

    this.storage.get('cowries').then((val) => {
      this.cowries = !val || val == null ? 30 : parseInt(val) + 30;
      this.storage.set('cowries', Number(this.cowries));
    });
    this.roundStatus();
  }


  getPerkCount() {

    this.storage.get('juju').then((val) => {
      this.jujuCount = !val || val == null ? 0 : Number(val);
    });


    this.storage.get('giraffes').then((val) => {
      this.girraffesCount = !val || val == null ? 0 : Number(val);
    });

    this.storage.get('begibegi').then((val) => {
      this.begibegiCount = !val || val == null ? 0 : Number(val);
    });

  }

  getRankTitle(rank) {
    this.rankName.forEach((i, j) => {
    if((rank-1) == j) {
          this.rankDef = i;
        }
    });
  }

  awoof(){
    this.router.navigate(['/awoof']);
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
