import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

@Injectable({
  providedIn: 'root'
})
export class GeoService {

  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder
  ) { }


  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };


  // getCoords():any{
  //   await this.geolocation.getCurrentPosition().then((resp) => {
  //     // resp.coords.latitude
  //     // resp.coords.longitude
  //     return this.reverseGeo(resp.coords.latitude,resp.coords.longitude);
  //    }).catch((error) => {
  //      console.log('Error getting location', error);
  //      return this.reverseGeo(6.465422, 3.406448);
  //    });
  // }

  getCoords() {
    return void this.geolocation.getCurrentPosition().then((resp) => {
      return this.reverseGeo(resp.coords.latitude,resp.coords.longitude);
     }).catch((error) => {
       console.log('Error getting location', error);
       return this.reverseGeo(6.465422, 3.406448);
     });
  }


  async reverseGeo(lat,long){
  await this.nativeGeocoder.reverseGeocode(lat, long, this.options).then((result: NativeGeocoderResult[]) => {
      // console.log(JSON.stringify(result[0]));
      alert(result[0].countryName);
      //Nigeria
      return JSON.stringify(result[0].countryName);
    }
  ).catch((error) => {
      return error;
      console.log(error);
      // alert('ERROR: '+ JSON.stringify(error));
    }
  );

  }





}

