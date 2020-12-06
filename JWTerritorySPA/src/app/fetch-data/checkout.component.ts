import { HttpClient } from "@angular/common/http";
import { Observable, Subject, interval } from 'rxjs';
import { debounce } from 'rxjs/operators';
import { formatDate } from "@angular/common";
import { Checkout, Territory } from "./interfaces";
import { Component, Inject, OnInit, Input, OnChanges, SimpleChanges, ElementRef, ViewChild } from "@angular/core";
import * as config from '../app-config.json';

@Component({
  selector: 'checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  @Input() checkout: Checkout;


  private http: HttpClient;
  private postUrl: string;
  private subject = new Subject<boolean>();
  private focused = false;
  private isModified = false;
  public updating = false;
  public errored = false;
  private tableFormat: string;

  setTableStyle() {
    let bc = 'white';

    if (this.errored) {
      bc = 'red';
    }
    else if ((this.name.length > 0 || this.checkedIn.length > 0 || this.checkedOut.length > 0)
      && !(this.name.length > 0 && this.checkedOut.length > 0)) {
      bc = 'red';
    } else if (this.checkedOut.length > 0 && this.checkedIn.length > 0 && (new Date(this.checkedOut) >= new Date(this.checkedIn))) {
      bc = 'red';
    }
    else if (this.checkedOut.length > 0 && this.checkedIn.length == 0) {
      bc = 'lightblue';
    } else if (this.name && this.name.length > 0) {
      bc = 'lightgray';
    }

    return { 'background-color': bc };
  }

  constructor(http: HttpClient) {
    this.http = http;
    this.postUrl = config.resources.jwTerritoryApi.resourceUri + 'checkout';
    //this.checkout = co;

    this.tableFormat = "table_success";

    this.subject.pipe(
      debounce(() => interval(2000)))
      .subscribe((doUpdate) => {

        if (doUpdate) {
          // Don't save dates mid-entry
          if ((this.checkedOut.length == 0 || this.checkedOut.length == 10)
            && (this.checkedIn.length == 0 || this.checkedIn.length == 10)) {
            this.updateCheckout();
          }
        }
      });

  }

  ngOnInit() {
    this.name = this.checkout.name ? this.checkout.name : "";
    this.checkedOut = this.checkout.checkedOut ? formatDate(this.checkout.checkedOut, "yyyy-MM-dd", 'en-US') : "";
    this.checkedIn = this.checkout.checkedIn ? formatDate(this.checkout.checkedIn, "yyyy-MM-dd", 'en-US') : "";
  }

  public checkedOut: string;
  public checkedIn: string;
  public name: string;

  nameKeyup(event: any) {
    this.activity();

    if (this.name.length > 0 && this.checkedOut.length == 0) {
      this.checkedOut = formatDate(Date.now(), "yyyy-MM-dd", 'en-US')
    }
  }

  activity() {
    this.isModified = true;
    this.subject.next(true);
  }

  focusOut() {
    if (this.name.length == 0 && (this.checkedOut.length > 0 || this.checkedIn.length > 0)) {
      this.checkedIn = "";
      this.checkedOut = "";
      this.isModified = true;
    } else if (this.checkedOut.length == 0 && this.checkedIn.length > 0) {
      this.checkedIn = "";
      this.isModified = true;
    }

    this.subject.next(false);
    // User may not have modified it and the subject updated it already
    if (this.isModified) {
      this.updateCheckout();
    }
  }

  updateCheckout() {

    let co = {
      checkoutId: this.checkout.checkoutId,
      territoryId: this.checkout.territoryId,
      name: this.name.length > 0 ? this.name : null,
      checkedOut: this.checkedOut.length > 0 ? new Date(this.checkedOut) : null,
      checkedIn: this.checkedIn.length > 0 ? new Date(this.checkedIn) : null,
    };

    this.updating = true;
    this.isModified = false;

    this.http.post<Checkout>(this.postUrl, co)
      .subscribe(success => {
        this.checkout = co; // Keep track of what was last successfully saved
        this.updating = false;
        this.errored = false;
      }, error => {
        this.ngOnInit(); // Revert back to what was last successfully saved
        this.updating = false;
        this.errored = true;
        console.error(error);
      }
      );

  }

}
