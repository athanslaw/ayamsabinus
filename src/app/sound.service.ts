import { Injectable } from '@angular/core';
import {Howl, Howler} from 'howler';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  sound:boolean = true;
  sfx:boolean = true;
  playing:boolean = false;

  themeSong = new Howl({
    src: ['../assets/audio/theme-song-loop.mpeg'],
    volume: 0.2,
    loop: true
  });

  selectSound = new Howl({
    src: ['../assets/audio/stapler.mp3'],
    volume: 0.7
  });

  clearSound = new Howl({
    src: ['../assets/audio/buttonpush.mp3'],
    volume: 0.2
  });

  cowrieSound = new Howl({
    src: ['../assets/audio/pokerchip.mp3'],
    volume: 0.8
  });

  errorSound = new Howl({
    src: ['../assets/audio/error.mp3'],
    volume: 0.8
  });

  glitterSound = new Howl({
    src: ['../assets/audio/glitter.mp3'],
    volume: 0.8
  });

  correctSound = new Howl({
    src: ['../assets/audio/door.mp3'],
    volume: 0.8
  });

  constructor() { }

  playThemeSong(){
    if (!this.sound || this.playing ) {return;}
    this.themeSong.play();
    this.playing = true;
  }

  playSelectSound(){
    if (!this.sfx) {return;}
    this.selectSound.play();
  }


  playClearSound(){
    if (!this.sfx) {return;}
    this.clearSound.play();
  }

  playCowrieSound(){
    if (!this.sfx) {return;}
    this.cowrieSound.play();
  }

  playErrorSound(){
    if (!this.sfx) {return;}
    this.errorSound.play();
  }


  playPositiveStickerSound(sn){
    let stickerPositiveSound = new Howl({
      src: [`../assets/audio/stickersounds/positive/${sn}.mp3`],
      volume: 0.9
    });
    stickerPositiveSound.play();
  }


  playNegativeStickerSound(sn){
    if (sn < 14) {
      var stickerNegativeSound = new Howl({
        src: [`../assets/audio/stickersounds/negative/${sn}.mp3`],
        volume: 0.9
      });
    }else{
      var stickerNegativeSound = new Howl({
        src: [`../assets/audio/stickersounds/negative/${sn}.mp4`],
        volume: 0.9
      });
    }
    stickerNegativeSound.play();
  }

  playGlitterSound(){
    this.glitterSound.play();
  }

  toggleSound(stat){
    this.sound = stat;
    if (!stat) {
      this.themeSong.stop(); 
      this.playing = false; 
    }else{
      if (this.playing) {return;}
      this.themeSong.play();
    }
  }

  toggleSfx(stat){
    this.sfx = stat;
  }

  getSoundStat(){
    return this.sound;
  }

  getSfxStat(){
    return this.sfx;
  }

  playCorrectSound() {
    this.correctSound.play();
  }

  stopThemeSong(){
    this.themeSong.stop();
    this.playing = false;
  }

}
