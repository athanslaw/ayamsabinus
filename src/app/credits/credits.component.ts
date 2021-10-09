import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss'],
})
export class CreditsComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {}

  back(){
    this.router.navigate(['/settings']);
  }

}
