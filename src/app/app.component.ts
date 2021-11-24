import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

import { SoundService } from './sound.service';

import { BackgroundMode } from '@ionic-native/background-mode/ngx/';
//import { FcmService } from './services/fcm.service';
//import { FCM } from '@ionic-native/fcm/ngx';
import { Capacitor } from '@capacitor/core';
// https://devdactic.com/push-notifications-ionic-capacitor/
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private screenOrientation: ScreenOrientation,
    private soundService: SoundService,
    public backgroundMode: BackgroundMode) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // if(this.platform.is('android') && !this.backgroundMode.isEnabled()) {
      //       this.backgroundMode.enable();
      // }
      this.statusBar.styleDefault();
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

      console.log("platform",Capacitor.platform);
      // prevent default back
      if (Capacitor.platform !== "web") {

        this.platform.backButton.subscribeWithPriority(99, () => { 
          console.log("Back button Clicked")
          //var backRoute = this.prevRoute.getPreviousUrl();
          alert("Kindly use the back button within the app");
          
        });
      }
      // subscribe to a topic
      // this.fcm.subscribeToTopic('Deals');
/*
      // get FCM token
      this.fcm.getToken().then(token => {
        console.log(token);
      });

      // ionic push notification example
      this.fcm.onNotification().subscribe(data => {
        console.log(data);
        if (data.wasTapped) {
          console.log('Received in background');
        } else {
          console.log('Received in foreground');
        }
      });
*/
      // unsubscribe from a topic
      // this.fcm.unsubscribeFromTopic('offers');


      // Trigger the push setup

      //this.fcmService.initPush();

      // this.backgroundMode.on('activate').subscribe(() => {
      //   this.soundService.stopThemeSong();
      // });

      // this.backgroundMode.on('enable').subscribe(() => {
      //   this.soundService.stopThemeSong();
      // });

      // this.backgroundMode.enable();
      setTimeout(()=>{
        this.splashScreen.hide();
      },1000)
    });
  }




}
