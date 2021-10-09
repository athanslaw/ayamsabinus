import { Component, OnInit } from '@angular/core';
import { WordsService } from '../words.service';
import { Word } from '../interfaces/Word';
// import { fstat } from 'fs';
import * as $ from 'jquery';
import { gsap, TimelineLite, TimelineMax, TweenMax, Back, Power1 } from 'gsap';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.scss'],
})
export class ArenaComponent implements OnInit {


  words: any;
  levelWords: any[];
  levelLength: number;
  levelMarker: number = 0;
  level: number = 1;
  totalLevels: number;


  currentWord: Word;
  currentWordSplit: string[];

  lastLetterInt: number;

  wordArray: any[] = [];


  compact: any[] = [];
  compactShuffled: any[] = [];


  selectedLetters: any[] = [];

  sticker: string;

  giraffeI: number





  constructor(
    private wordsService: WordsService
  ) { }

  ngOnInit() {
    this.fetchWords();
    this.animateSticker();
  }



  async fetchWords() {

    console.log(this.level);
    console.log(this.levelMarker);

    this.wordsService.fetchWords()
      .subscribe(
        (data) => {
          this.words = data;
          this.levelWords = this.words[this.words.findIndex(w => w.LEVEL == this.level.toString())];
          this.levelLength = this.levelWords["WORDS"].length - 1;
          this.totalLevels = this.words.length;

          // console.log(this.totalLevels);
          this.currentWord = this.levelWords["WORDS"][this.levelMarker];
          this.currentWordSplit = this.split(this.currentWord.word);
          this.wordArray = this.splitWords(this.currentWord.word);

          this.lastLetterInt = this.currentWordSplit.length - 1;

          // console.log(this.currentWordSplit);
          // console.log(this.wordArray);

          this.setupCompact();


        }
      );

  }


  split(str) {
    var res = str.split("");
    return res;
  }


  splitWords(str) {
    var res = str.split(" ");
    return res;
  }



  setupCompact() {

    this.compact = [];

    this.currentWordSplit.forEach((item, index) => {
      this.compact.push({
        letter: item,
        visible: false,
        selected: false,
        hint: false,
        idCode: this.create_UUID()
      })
    });


    this.compactShuffle();
    // console.log(this.compact);

  }


  compactShuffle() {
    this.compactShuffled = this.shuffle(this.compact);
    // console.log(this.compactShuffled);
  }





  selectLetter(id, fullObj, i) {

    let check = this.checkIfHasBeenSelected(fullObj) ? true : false;

    if (check) {
      return;
    }


    let indx = this.compact.findIndex(function (curr, i, arr) {
      return curr.idCode == id;
    })

    this.selectedLetters.push(this.compact[indx]);
    this.compactShuffled[i].selected = true;

  }






  submitTray() {



    let wordString = [];
    let matchFound = false;

    for (let i = 0; i < this.selectedLetters.length; i++) {
      wordString.push(this.selectedLetters[i].letter);
    }


    for (let j = 0; j < this.wordArray.length; j++) {

      const w = this.wordArray[j];

      if (w == wordString.join("")) {
        matchFound = true;
        break;
      }

    }


    if (matchFound) {
      this.rightSelections();
      // console.log("match found")
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

    }, 1500);


  }


  rightSelections() {
    // loop through barcompact
    //search for selected 1 in barcompact and check if next letter in barcompact matches selected
    //if it does break from the loop and celebrate

    for (let i = 0; i < this.compact.length; i++) {
      var element = this.compact[i];
      var nextElement = i !== (this.compact.length - 1) ? this.compact[i + 1] : this.compact[i];
      var letter = element.letter;
      var nextLetter = nextElement.letter;

      if ((letter == this.selectedLetters[0].letter) && (nextLetter == this.selectedLetters[1].letter) && (!element.visible)) {
        this.makeLettersVisible(i);
        break;
      }

    }

  }




  makeLettersVisible(firstMatchArrayIndex) {

    var matchingIdCodes = [];

    //loop here
    let loopCounter = 0;

    //get idcodes from first matching letter to length of selected letters
    for (let i = 0; i < this.selectedLetters.length; i++) {
      matchingIdCodes.push(this.compact[firstMatchArrayIndex + loopCounter].idCode);
      loopCounter++;
    }


    this.compact.forEach((l) => {
      if (matchingIdCodes.includes(l.idCode)) {
        l.visible = true;
      }
    });

    $(".ayoTray").addClass("animate__bounce");

    this.selectedLetters = [];


    //check if all words are completed and go to next round

    if (this.checkIfRoundComplete()) {

      this.randomSticker("positive");

      if (this.levelMarker >= this.levelLength) {

        //check if there are more levels
        if (this.level < this.totalLevels) {

          //go to next level;
          this.level += 1;
          this.levelMarker = 0;
          setTimeout(() => {
            this.fetchWords();
          }, 1500);

        } else {
          alert("Game over");
        }

      } else {

        //go to next word
        this.levelMarker += 1;
        setTimeout(() => {
          this.fetchWords();
        }, 1500);

      }

    }


    //remove bounce class from previous success
    setTimeout(() => {
      $(".ayoTray").removeClass("animate__bounce");
    }, 2000);



  }



  checkIfRoundComplete() {
    let completed = true;
    let filter = this.compact.filter((item, i) => {
      return item.letter !== " ";
    });
    for (let i = 0; i < filter.length; i++) {
      const letter = filter[i];
      if (!letter.visible) {
        completed = false;
      }
    }
    return completed;
  }

  revealRandom() {
    this.giraffeI = Math.floor(Math.random() * this.compact.length);
    return this.compact[this.giraffeI];
  }

  giraffe() {
    //check if player has coins then deduct coins per click
    let r = this.revealRandom();

    if (!r.hint && r.letter !== " ") {
      r.hint = true;
      $(".hole").addClass("animate__bounce");
      setTimeout(() => { $(".hole").removeClass("animate__bounce"); }, 1000);
    } else {
      this.giraffe();
    }
  }

  //utility function
  checkIfHasBeenSelected(obj) {
    return this.arrayContainsObject(obj, this.selectedLetters)
  }

  arrayContainsObject(obj, array) {
    var i;
    for (i = 0; i < array.length; i++) {
      if (array[i] === obj) {
        return true;
      }
    }
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

    this.sticker = PosOrNeg == "positive" ? `../../assets/stickers/positive/${Math.floor(Math.random() * 34) + 1}.png` : `../../assets/stickers/negative/${Math.floor(Math.random() * 20) + 1}.png`;
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

}
