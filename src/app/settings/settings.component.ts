import { Component, OnInit } from '@angular/core';
import { SoundService } from '../sound.service';
import { Router } from '@angular/router';
import { AppRate } from '@ionic-native/app-rate/ngx';
import { Location } from '@angular/common';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  soundStat:boolean = true;
  sfxStat:boolean = true;

  constructor(
    private soundService: SoundService,
    private router: Router,
    private appRate: AppRate,
    private _location: Location
  ) { }

  ngOnInit() {
    this.soundStat = this.soundService.getSoundStat();
    this.sfxStat = this.soundService.getSfxStat();
  }


toggleSound(){
  this.soundStat = !this.soundStat;
  this.soundService.toggleSound(this.soundStat);
}

toggleSfx(){
  this.sfxStat = !this.sfxStat;
  this.soundService.toggleSfx(this.sfxStat);
}


back(){
  this._location.back();
}

helep() {
  this.router.navigate(['/helep']);
}
level() {
  this.router.navigate(['/level']);
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



}
