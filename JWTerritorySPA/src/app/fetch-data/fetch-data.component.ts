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
  private _exportUrl: string;
  private _http: HttpClient;
  constructor(http: HttpClient) {

    this._baseUrl = config.resources.jwTerritoryApi.resourceUri;
    this._exportUrl = config.resources.jwTerritoryApi.exportUri;


    http.get<string[]>(this._baseUrl + 'sections').subscribe(result => {
      this.sections = result;
    }, error => console.error(error));
    this._http = http;
  }



  backup() {
    this._http.get(this._exportUrl + 'Backup', { responseType: 'blob' }).subscribe(blob => {
      const a = document.createElement('a')
      const objectUrl = URL.createObjectURL(blob)
      a.href = objectUrl
      a.download = 'backup.csv';
      a.click();
      URL.revokeObjectURL(objectUrl);

    });
  }
}


