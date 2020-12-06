import { Component, OnInit } from '@angular/core';
import { FetchDataComponent } from '../fetch-data/fetch-data.component';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isUser: boolean;

  constructor(private _msalService: MsalService) { }

  ngOnInit(): void {
    let user = this._msalService.getAccount();
    this.isUser = user ? true : false;
  }

}
