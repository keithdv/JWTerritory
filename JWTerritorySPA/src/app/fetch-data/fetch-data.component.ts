import { Component, Inject, OnChanges, SimpleChange, SimpleChanges, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { formatDate } from '@angular/common';

import { error } from '@angular/compiler/src/util';
import { Territory } from './interfaces';
import * as config from '../app-config.json';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html',
  styleUrls: ['./fetch-data.component.css']
})
export class FetchDataComponent {
  public sections: string[];
  private _baseUrl: string;

  constructor(http: HttpClient) {

    this._baseUrl = config.resources.jwTerritoryApi.resourceUri;



    http.get<string[]>(this._baseUrl + 'sections').subscribe(result => {
      this.sections = result;
    }, error => console.error(error));
  }

}


