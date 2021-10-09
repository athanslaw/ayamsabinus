import { Component, OnInit } from '@angular/core';
import { WordsService } from '../words.service';
import { Word } from '../interfaces/Word';
import { Storage } from '@ionic/storage';
import * as $ from 'jquery';
import { gsap, TimelineLite, TimelineMax, TweenMax, Back, Power1 } from 'gsap';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.scss'],
})
export class LevelComponent implements OnInit {

  ranks:any;
  rankLenth:number;
  selectedRank:number;
  selectedLevel:number;
  cowries:number;

  rank:number;
  level:number;
  levelMarker:number;


  map = {
    "1": 'jjc',
    "2": 'smallie',
    "3": 'bridge',
    "4": 'jnrsabinus',
    "5": 'snrlearner',
    "6": 'ogapikin',
    "7": 'correctpesin',
    "8": 'snrpesin',
    "9": 'areapesin',
    "10": 'shapito'
}

  // played:any[] = [
  //   {
  //     rank:0,
  //     level:0,
  //     word:0
  //   },
  //   {
  //     rank:0,
  //     level:0,
  //     word:1
  //   },
  //   {
  //     rank:0,
  //     level:0,
  //     word:2
  //   }
  // ]

  constructor(
    private wordsService: WordsService,
    private storage: Storage,
    private router: Router,
    private _location: Location,
  ) { }

  ngOnInit() {


    this.fetchPlayData()
    this.storage.get('cowries').then((val) => {
      this.cowries = val;
    });
    this.fetchWords();
  }


  async fetchWords(){

    this.wordsService.fetchWords()
    .subscribe(
      (data) => {

        this.ranks = data;
        this.rankLenth = this.ranks.length;

        // console.log(this.ranks);

      }
    );

}



playWord(i,x,z){

  if (this.locked(i,x,z)) {
    return;
  }

  let payload = {
    rank: i,
    level: x,
    word: z
  }

  this.router.navigate(['/levelarena', i,x,z]);

}


back(){
  this._location.back();
}


toggleRank(i){

  $(".levels").css('display','none');

  this.selectedRank = i;
  this.selectedLevel = 1000;

  setTimeout(() => {
  $(".levels").slideDown(250);
  }, 100);

}

showRankLevels(i){
  return i !== this.selectedRank;
}


toggleLevel(x){

  this.selectedLevel = x;

}


showLevelWords(i,x){
  return i == this.selectedRank && x == this.selectedLevel;
}


showChain(i){
  return  i+1==this.rankLenth ? '' : '../../assets/level/endchain.png';
}


hasBeenPlayed(rnk,lvl,wrd){



    if (this.rank > rnk) {
        return '../../assets/level/wordbox.png';
    }else if(this.rank < rnk){
        return '../../assets/level/wordboxlocked.png';
    }else if(this.rank == rnk){

            if (this.level > lvl) {
              return '../../assets/level/wordbox.png';
            }else if(this.level < lvl){
              return '../../assets/level/wordboxlocked.png';
            }else if(this.level == lvl){
                  if (this.levelMarker > wrd) {
                    return '../../assets/level/wordbox.png';
                  }else{
                    return '../../assets/level/wordboxlocked.png';
                  }
            }

    }

}



locked(rnk,lvl,wrd){

  if (this.rank > rnk) {
    return false;
}else if(this.rank < rnk){
    return true;
}else if(this.rank == rnk){

        if (this.level > lvl) {
          return false;
        }else if(this.level < lvl){
          return true;
        }else if(this.level == lvl){
              if (this.levelMarker > wrd) {
                return false;
              }else{
                return true;
              }
        }

}


}



toggleBtn(i,x){
 return i == this.selectedRank && x == this.selectedLevel ? '../../assets/level/collapse.png' : '../../assets/level/expand.png';
}




rankImg(i){
  return `../../assets/level/ranks/${this.map[i]}.png`;
}


async fetchPlayData(){
  await this.storage.get('rank').then((val) => {
    this.rank = val-1;
    console.log(this.rank);
  });

  await this.storage.get('level').then((val) => {
    this.level = val-1;
    // console.log(this.level);
  });


  await this.storage.get('levelMarker').then((val) => {
    this.levelMarker =  val-1;
    console.log(this.levelMarker);
  });
}





}
