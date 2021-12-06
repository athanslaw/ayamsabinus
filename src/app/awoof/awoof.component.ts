import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GeoService } from '../geo.service';
import { ToastController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Location } from '@angular/common';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

import * as $ from 'jquery';

@Component({
  selector: 'app-awoof',
  templateUrl: './awoof.component.html',
  styleUrls: ['./awoof.component.scss'],
})
export class AwoofComponent implements OnInit {
  toastMessage: string = "";
  sabinusId:string = "";
  imageSrc:string = "../../assets/awoof/awoof.png";
  myLocation: any;
  smallie:number = 1800;
  oga:number = 3200;
  presido:number = 10500;
  chairman:number =19500;
  jagaban:number = 50000;

  constructor(
    private router: Router,
    private userService: UserService,
    private storage: Storage,
    private iab: InAppBrowser,
    private ngxService: NgxUiLoaderService,
    private geoService: GeoService,

    private geolocation: Geolocation,
    private _location: Location,
    private nativeGeocoder: NativeGeocoder,
    private toastController: ToastController
  ) { }


  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  async ngOnInit() {
    $(".networkPane").fadeOut();
    // await this.geoService.getCoords().then(res => {
    //   if (res == "Nigeria") {
    //     this.imageSrc = "../../assets/awoof/awoof4.png";
    //   } else {
    //     // if (c !== "Nigeria" ) {
    //       // return;
    //       this.imageSrc = "../../assets/awoof/awoof4.png";
    //     // }
    //   }
    // });
    this.getSabinusId();
    await this.getCoords();

    // let c = await this.geoService.getCoords();
    // alert("get coordinates: "+ c);
    // if (!c) {
    //   this.imageSrc = "../../assets/awoof/awoof4.png";
    // } else {
    //   if (c != "Nigeria" ) {
    //     // return;
    //     this.imageSrc = "../../assets/awoof/awoof3.png";
    //   }
    // }

  }

  getSabinusId(){
    this.storage.get('sabinusid').then((val) => {
      if (!val) {
        this.sabinusId = "";
      } else {
        this.sabinusId = val;
        this.logGameScore();
      }
    });
  }

  getCoords() {
    return this.geolocation.getCurrentPosition().then((resp) => {
      // alert('resp location'+ JSON.stringify(resp));
      return this.reverseGeo(resp.coords.latitude,resp.coords.longitude);
     }).catch((error) => {
       console.log('Error getting location', error);
       return this.reverseGeo(6.465422, 3.406448);
     });
  }


  async reverseGeo(lat,long){
  await this.nativeGeocoder.reverseGeocode(lat, long, this.options).then((result: NativeGeocoderResult[]) => {
      // console.log(JSON.stringify(result[0]));
      // const c = result[0].countryName;
      this.myLocation = result[0].countryName;
      // Nigeria
      //  alert(this.myLocation);

      if(this.myLocation == 'Nigeria') {
        this.imageSrc = "../../assets/awoof/awoof.png";
      } else {
        this.imageSrc = "../../assets/awoof/awoof3.png";
        this.populateAmount();
      }

       // return JSON.stringify(result[0].countryName);

    }).catch((error) => {
      return error;
      // alert('ERROR: '+ JSON.stringify(error));
    }
  );

  }
  populateAmount(){
    this.smallie = 9;
    this.oga = 16;
    this.presido = 54;
    this.chairman=97;
    this.jagaban = 250;
  }

  getPrice(tag){
    if(tag=='smallie') return this.smallie;
    if(tag=='oga') return this.oga;
    if(tag=='presido') return this.presido;
    if(tag=='chairman')return this.chairman;
    if(tag=='jagaban')return this.jagaban;
  }

  async giveValue(){
    //fetch from remote
    const sid = this.sabinusId;
    this.userService.fetchUser(sid).subscribe((res) => {

      this.storage.set('cowries', Number(res["user"][0]["cowries"]));

      this.storage.set('juju', Number(res["user"][0]["juju"]));

      this.storage.set('giraffes', Number(res["user"][0]["giraffes"]));

      this.storage.set('begibegi', Number(res["user"][0]["begibegi"]));

      this.storage.set('tokens', Number(res["user"][0]["tokens"]));
    });
  }

  logGameScore(){
    let cowries;
    this.storage.get('cowries').then((val) => {
      cowries = !val || val == null ? 0 : parseInt(val);
      this.userService.logPlayerCowries(this.sabinusId, Number(cowries)).subscribe((res)=>{ });
    });
  }
  
  buy(tag){
     if (this.sabinusId == "") {
        // alert("User not logged in");
        this.toast("User not logged in");
      }else{
        let price = this.getPrice(tag);
        console.log("PRICE",price)
        this.ngxService.start();
        // const browser = this.iab.create("https://paystack.com");
        this.userService.getPaystackLink(this.sabinusId,price*100,tag).subscribe((res) => {
          this.ngxService.stop();
          let url = res["data"]["authorization_url"];
          const browser = this.iab.create(url);
          console.log("Response: "+JSON.stringify(res))
        },(err)=>{
          this.ngxService.stop();
          this.checkNetwork("Something went wrong");
        });
      }
  }

  back(){
    this.giveValue();
    this._location.back();
  }

  fetchProfileRemote(sid){
  if (!sid) {
    this.router.navigate(['/landing']);
    return;
  }

  this.userService.fetchUser(sid).subscribe((res) => {
    console.log(res["user"][0]);
    let cowries = res["user"][0]["cowries"];
    this.storage.set('cowries', cowries);
    //
    let juju = res["user"][0]["juju"];
    this.storage.set('juju', juju);
    //
    let giraffes = res["user"][0]["giraffes"];
    this.storage.set('giraffes', giraffes);
    //
    let begibegi = res["user"][0]["begibegi"];
    this.storage.set('begibegi', begibegi);
    //
    let tokens = res["user"][0]["tokens"];
    this.storage.set('tokens', tokens);

    this.router.navigate(['/landing']);
  },()=>{
    this.router.navigate(['/landing']);
  });

}

 showNetwork(){
    $(".networkPane").fadeIn();
    setTimeout(() => {
      $(".networkPane").fadeOut();
    }, 3000);
 }

checkNetwork(errorMsg){
  this.userService.fetchUser("ddd").subscribe((res) => {
    console.log("here");
    this.toast(errorMsg);
  },(err)=>{
    this.showNetwork();
  });
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

toast_error(tm){
  this.toastController.create({
      message: tm,
      position: 'bottom',
      cssClass: 'toast-error-class',
      duration: 4000,
      buttons: [ {
          side: 'end',
          icon: 'close-circle',
          role: 'cancel'
        }
      ]
    }).then((toast) => {
      toast.present();
    });
}

}
