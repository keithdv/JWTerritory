import { Component, Input, OnInit } from "@angular/core";
import { TerritoryLastRecord } from "./interfaces";
import { HttpClient } from '@angular/common/http';
import * as config from '../app-config.json';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'territorylastrecord',
  templateUrl: './territorylastrecord.component.html',
  styleUrls: ['./territorylastrecord.component.css']
})
export class TerritoryLastRecordComponent implements OnInit {

  private _baseUrl: string;
  public territorylastrecord: TerritoryLastRecord[];


  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this._baseUrl = config.resources.jwTerritoryApi.exportUri;

  }

  ngOnInit() {

    this.route.params.subscribe(params => {

      this.http.get<TerritoryLastRecord[]>(this._baseUrl + 'LastRecords').subscribe(result => {

        this.territorylastrecord = result;

      }, error => console.error(error));
    });



  }

}
