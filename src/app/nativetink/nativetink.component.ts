import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-nativetink',
  templateUrl: './nativetink.component.html',
  styleUrls: ['./nativetink.component.scss'],
})
export class NativetinkComponent implements OnInit {

  imageString:String = "../../assets/nativetink/logo.png";
  tracker: number = 0;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {


    setTimeout(() => {
      $(".nativelogo").fadeOut();
    }, 3000);

    setTimeout(() => {
      this.imageString = "../../assets/nativetink/caption2.png";
    }, 3500);

    setTimeout(() => {
      $(".nativelogo").fadeIn();
    }, 3700);


    setTimeout(() => {
      $(".nativelogo").fadeOut();
    }, 6000);

    setTimeout(() => {
      this.imageString = "../../assets/nativetink/caption3.png";
    }, 6500);

    setTimeout(() => {
      $(".nativelogo").fadeIn();
    }, 6700);


    setTimeout(() => {
      $(".nativelogo").fadeOut();
    }, 9000);

    setTimeout(() => {
      this.imageString = "../../assets/nativetink/caption4.png";
    }, 9500);

    setTimeout(() => {
      $(".nativelogo").fadeIn();
    }, 9700);


    setTimeout(() => {
      this.tracker=2;
      this.router.navigate(['/landing']);
    }, 12000);

    console.log("tracker: ",this.tracker);
    if(this.tracker==2){
      this.router.navigate(['/landing']);
    }

    // setTimeout(() => {
    //   this.imageString = "../../assets/nativetink/caption2.png";
    // }, 3000);

    // setTimeout(() => {
    //   this.imageString = "../../assets/nativetink/caption3.png";
    // }, 7000);

    // setTimeout(() => {
    //   this.imageString = "../../assets/nativetink/caption4.png";
    // }, 11000);

    // setTimeout(() => {
    //         this.router.navigate(['/landing']);
    // }, 15000);



  }

}
