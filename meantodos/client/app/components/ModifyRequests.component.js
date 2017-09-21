"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var core_2 = require('angular2-google-maps/core'); // GOOGLE MAPS
var customer_service_1 = require('../services/customer.service');
var ModifyRequestsComponent = (function () {
    function ModifyRequestsComponent(router, _customerService, mapsAPILoader, ngZone) {
        this.router = router;
        this._customerService = _customerService;
        this.mapsAPILoader = mapsAPILoader;
        this.ngZone = ngZone;
        this.NgPhoneNum = "";
        this.Ngemail = "";
        this.DeclinedRequest = false;
        this.NoDeclinedRequest = false;
        this.DeclineSuccess = [];
    }
    ModifyRequestsComponent.prototype.ngOnInit = function () {
    };
    ModifyRequestsComponent.prototype.CancelRideRequest = function () {
        var _this = this;
        console.log(this.DeclineSuccess);
        this.DeclinedRequest = false;
        this.NoDeclinedRequest = false;
        var emailObj = {
            email: this.Ngemail
        };
        var EmailObject = {
            cusEmail: this.Ngemail,
            subject: "Update: Your Ride is Cancelled - Ali-Taxi",
            content: "\n              This is an automatic message. \n              You recently Cancelled your ride request.  \n\n                Thank you,\n                From Ali-Taxi Team."
        };
        var result = this._customerService.UpdateRequestToDeclined(emailObj);
        result.subscribe(function (declinestatus) {
            _this.DeclineSuccess = declinestatus;
            if (_this.DeclineSuccess >= 1) {
                _this.DeclinedRequest = true;
                console.log(_this.DeclineSuccess);
            }
            else if (_this.DeclineSuccess == 0) {
                _this.NoDeclinedRequest = true;
            }
            _this.sendEmail(EmailObject);
        });
    };
    ModifyRequestsComponent.prototype.sendEmail = function (EmailObject) {
        this._customerService.sendemail(EmailObject)
            .subscribe(function (result) {
            console.log(result);
        });
    };
    ModifyRequestsComponent.prototype.log = function (x) {
        console.log(x);
        console.log(this.searchElement);
    };
    ModifyRequestsComponent.prototype.GoBackHomePage = function () {
        this.router.navigate(['.']);
    };
    ModifyRequestsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'ModifyRequests',
            templateUrl: 'ModifyRequests.component.html',
            styleUrls: ['ModifyRequests.component.css']
        }), 
        __metadata('design:paramtypes', [router_1.Router, customer_service_1.CustomerService, core_2.MapsAPILoader, core_1.NgZone])
    ], ModifyRequestsComponent);
    return ModifyRequestsComponent;
}());
exports.ModifyRequestsComponent = ModifyRequestsComponent;
//# sourceMappingURL=ModifyRequests.component.js.map