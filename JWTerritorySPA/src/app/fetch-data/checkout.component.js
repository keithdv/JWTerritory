"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var common_1 = require("@angular/common");
var CheckOutComponent = /** @class */ (function () {
    function CheckOutComponent(http, postUrl, co) {
        var _this = this;
        this.subject = new rxjs_1.Subject();
        this.updated = false;
        this.updating = false;
        this.tableClasses = {
            table_default: !this.updating && !this.updated,
            table_modified: this.updated,
            table_success: this.updating,
        };
        this.http = http;
        this.postUrl = postUrl;
        this.checkout = co;
        this.tableFormat = "table_success";
        this.subject.pipe(operators_1.debounce(function () { return rxjs_1.interval(3000); }))
            .subscribe(function (co) { return _this.updateCheckout(co); });
    }
    Object.defineProperty(CheckOutComponent.prototype, "checkedOut", {
        get: function () {
            if (this.checkout.checkedOut) {
                var date = common_1.formatDate(this.checkout.checkedOut, "yyyy-MM-dd", 'en-US');
                return date;
            }
            return "";
        },
        set: function (d) {
            this.checkout.checkedOut = new Date(d);
            this.triggerUpdate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CheckOutComponent.prototype, "checkedIn", {
        get: function () {
            if (this.checkout.checkedIn) {
                var date = common_1.formatDate(this.checkout.checkedIn, "yyyy-MM-dd", 'en-US');
                return date;
            }
            return "";
        },
        set: function (d) {
            this.checkout.checkedIn = new Date(d);
            this.triggerUpdate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CheckOutComponent.prototype, "name", {
        get: function () {
            return this.checkout.name;
        },
        set: function (n) {
            this.checkout.name = n;
            this.triggerUpdate();
        },
        enumerable: true,
        configurable: true
    });
    CheckOutComponent.prototype.triggerUpdate = function () {
        if (!this.updated) {
            this.originalCheckOut = JSON.parse(JSON.stringify(this.checkout));
            this.updated = true;
        }
        this.subject.next(JSON.parse(JSON.stringify(this.checkout)));
    };
    CheckOutComponent.prototype.updateCheckout = function (co) {
        var _this = this;
        debugger;
        this.updating = true;
        this.http.post(this.postUrl, co)
            .subscribe(function (success) {
            _this.updating = false;
            _this.updated = false;
        }, function (error) {
            _this.updating = false;
            _this.updated = false;
            console.error(error);
        });
    };
    return CheckOutComponent;
}());
exports.CheckOutComponent = CheckOutComponent;
//# sourceMappingURL=checkout.component.js.map