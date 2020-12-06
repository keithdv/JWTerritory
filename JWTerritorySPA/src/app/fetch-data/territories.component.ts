import { Component, Input, OnInit } from "@angular/core";
import { Territory } from "./interfaces";
import { HttpClient } from '@angular/common/http';
import * as config from '../app-config.json';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'territories',
  templateUrl: './territories.component.html',
  styleUrls: ['./territories.component.css']
})
export class TerritoriesComponent implements OnInit {

  private _baseUrl: string;
  public territories: Territory[];


  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this._baseUrl = config.resources.jwTerritoryApi.resourceUri;

  }

  ngOnInit() {

    this.route.params.subscribe(params => {

      this.http.get<Territory[]>(this._baseUrl + params.section).subscribe(result => {

        this.territories = result;

      }, error => console.error(error));
    });

  }

}
