import { Component, Input, OnInit } from "@angular/core";
import { Territory } from "./interfaces";
import { HttpClient } from '@angular/common/http';
import * as config from '../app-config.json';
import { ActivatedRoute } from '@angular/router';
import { Subject, interval } from 'rxjs';
import { debounce } from 'rxjs/operators';



@Component({
  selector: 'territory',
  templateUrl: './territory.component.html'
})
export class TerritoryComponent implements OnInit {

  private _baseUrl: string;
  @Input() public territory: Territory;
  public notes: string;
  private subject = new Subject<boolean>();
  public errored: boolean;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this._baseUrl = config.resources.jwTerritoryApi.resourceUri;

    this.subject.pipe(
      debounce(() => interval(2000)))
      .subscribe((doUpdate) => {

        if (doUpdate) {
          // Don't save dates mid-entry
          this.update();
        }
      });
  }

  ngOnInit() {
    this.notes = this.territory.notes;
  }

  keyup(event: any) {
    this.subject.next(true);
  }

  focusout() {
    this.subject.next(false);
    this.update();
  }
  update() {
    let terr = {
      territoryId: this.territory.territoryId,
      notes: this.notes
    };

    this.http.post<Territory>(this._baseUrl, terr)
      .subscribe(success => {
        this.territory.notes = terr.notes;
        this.errored = false;
      }, error => {
        this.ngOnInit(); // Revert back to what was last successfully saved
        this.errored = true;
        console.error(error);
      }
      );
  }
}
