import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss'],
})
export class CreditsComponent implements OnInit {

  constructor(
    private router: Router,
    private _location: Location
  ) { }

  ngOnInit() {}

  back(){
    this._location.back();
  }

}
