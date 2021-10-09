import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicStorageModule } from '@ionic/storage';

import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { GamearenaComponent } from './gamearena/gamearena.component';
import { AppRoutingModule } from './app-routing.module';
import { AppRate } from '@ionic-native/app-rate/ngx';
import { LevelComponent } from './level/level.component';
import { ClickStopPropagationDirective } from './click-stop-propagation.directive';
import { LevelarenaComponent } from './levelarena/levelarena.component';
import { Facebook } from '@ionic-native/facebook/ngx'
import { ArenaComponent } from './arena/arena.component';
import { PadiplayComponent } from './padiplay/padiplay.component';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
// geolocation and native-geocoder
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

import { BackgroundMode } from '@ionic-native/background-mode/ngx/';
import { FCM } from '@ionic-native/fcm/ngx';

@NgModule({
  declarations: [AppComponent,LandingComponent,ArenaComponent,GamearenaComponent,LevelComponent, ClickStopPropagationDirective,LevelarenaComponent,PadiplayComponent,],
  entryComponents: [],
  imports: [
    BrowserModule,FormsModule, IonicModule.forRoot(),
    IonicStorageModule.forRoot({name: 'mydb', driverOrder: ['indexeddb', 'sqlite', 'websql']}),
    HttpClientModule, HttpClientJsonpModule, AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase), AngularFireAuthModule,
    NgxUiLoaderModule,],
  //imports: [BrowserModule,FormsModule, IonicModule.forRoot(), IonicStorageModule.forRoot({name: 'mydb', driverOrder: ['indexeddb', 'sqlite', 'websql']}),  HttpClientModule, HttpClientJsonpModule, AppRoutingModule, NgxUiLoaderModule,],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    Facebook,
    AppRate,
    GooglePlus,
    InAppBrowser,
    BackgroundMode,
    FCM,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Geolocation,
    NativeGeocoder,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
