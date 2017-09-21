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
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
var customer_service_1 = require('../services/customer.service');
//import {RequestRideComponent} from './RequestRide.component';
var ConfirmInfoComponent = (function () {
    function ConfirmInfoComponent(router, _customerService, route, _http) {
        this.router = router;
        this._customerService = _customerService;
        this.route = route;
        this._http = _http;
        this.fromLocTokenKey = 'app_token_confirmInfo_from';
        this.toLocTokenKey = 'app_token_confirmInfo_to';
        this.passengersTokenKey = 'app_token_confirmInfo_passengers';
        this.emailaddTokenKey = 'app_token_confirmInfo_emailadd';
        this.initialized = false;
        this.fullPath = 'app/assets/Preloader_8.gif';
        this.errorMsg = false;
        this.updated = false;
        this.mode = true;
        this.editing = false;
        this.NgFirstName = '';
        this.firstNameChanged = false;
        this.FirstNameUI = '';
        this.FromPlace = '';
        this.ToPlace = '';
        this.completeGoogleApiAddress = '';
        this.totalPayment = null;
        this.confirmPmtLoading = true;
        this.subtractCounter = null;
        this.orginalFee = 0;
        this.subErrorMsg = false;
        this.custDecAmt = false;
        this.NgCusComment = '';
        this.TollFromLoc = '';
        this.TollToLoc = '';
    }
    ConfirmInfoComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._customerService.getRidePaymentDetails()
            .subscribe(function (paymentinfo) {
            _this.RidePaymentDetails = paymentinfo;
        });
        var fromStoredToken = localStorage.getItem(this.fromLocTokenKey);
        var toStoredToken = localStorage.getItem(this.toLocTokenKey);
        var passengersStoredToken = localStorage.getItem(this.passengersTokenKey);
        // to calculate toll
        this.TollFromLoc = fromStoredToken;
        this.TollToLoc = toStoredToken;
        if (!fromStoredToken || !toStoredToken || !passengersStoredToken) {
            console.log("no token found");
        }
        else {
            console.log("From: " + fromStoredToken + " To: " + toStoredToken + "passengers: " + passengersStoredToken);
            //if(storedToken.indexOf("SignedIn"))
            if (fromStoredToken && toStoredToken && passengersStoredToken) {
                console.log(fromStoredToken.toString());
                console.log(toStoredToken.toString());
                this.FromPlace = fromStoredToken.replace(/["']/g, '');
                this.ToPlace = toStoredToken.replace(/["']/g, '');
                this.numOfPassengers = passengersStoredToken.replace(/["']/g, '');
                this.updateAddressForApi();
            }
        }
        this.googleDistanceInfo = [];
        this._customerService.getGoogleDist(this.completeGoogleApiAddress)
            .subscribe(function (distanceInfo) {
            //this.googleDistanceInfo = JSON.stringify(distanceInfo);
            _this.googleDistanceInfo = distanceInfo.body;
            console.log("Google Distance Info:");
            console.log(_this.googleDistanceInfo);
            _this.googleDistanceInfo = JSON.parse(distanceInfo.body);
            console.log(_this.googleDistanceInfo);
            var miles = JSON.parse(distanceInfo.body); // In variable type "any", you can get "any" property with "any" name as long as that variable actually has that property in run time
            _this.googleDistanceMilesInfo = miles.rows[0].elements[0].distance.text.replace('miles', '').replace(/ /g, ''); // In variable "object", you can only get properties that you actually "definied" which are "static - hardcoded"
            _this.CalculatePayment();
        });
        setTimeout(function () {
            _this.initialized = true;
        }, 7500);
        this.sub = this.route
            .queryParams
            .subscribe(function (params) {
            // Defaults to 0 if no query param provided.
            _this.page = +params['page'] || 0;
        });
        console.log(this.page + " this is the Customer ID from the router");
        // calls the service to retrieve the customer data
        this.customer = [];
        this._customerService.getSavedCustomer(this.page)
            .subscribe(function (customer) {
            _this.customer = customer;
        });
        console.log(JSON.stringify(this.customer));
        console.log("Loggin the Problem!");
        console.log(this.googleDistanceInfo);
        console.log(this.numOfPassengers);
        console.log(this.totalPayment);
        console.log(this.RidePaymentDetails);
    };
    ConfirmInfoComponent.prototype.updateAddressForApi = function () {
        var from = this.FromPlace.toString().replace('United States', '').replace(/ $/, "").replace(/[,]/g, '');
        var to = this.ToPlace.toString().replace('United States', '').replace(/ $/, "").replace(/[,]/g, '');
        this.googleFrom = from.replace(/ /g, "+");
        this.googleTo = to.replace(/ /g, "+");
        console.log(this.googleFrom + " - google from");
        console.log(this.googleTo + " - google to");
        console.log(this.googleFrom + "&destinations=" + this.googleTo);
        this.completeGoogleApiAddress = this.googleFrom + "&destinations=" + this.googleTo;
    };
    ConfirmInfoComponent.prototype.CalculatePayment = function () {
        console.log(this.RidePaymentDetails[0].FeePerMile + " -fee per mile");
        console.log(this.RidePaymentDetails[0].FeePerPassenger + " -fee per passenger");
        console.log(this.RidePaymentDetails[0].BaseFee + " -Base fee");
        console.log(this.RidePaymentDetails);
        var feePerMile = this.RidePaymentDetails[0].FeePerMile;
        var feePerPassenger = this.RidePaymentDetails[0].FeePerPassenger;
        var baseFee = this.RidePaymentDetails[0].BaseFee;
        var tollFee = 5;
        var peopleCal = this.numOfPassengers;
        var milesCal = this.googleDistanceMilesInfo.toString().replace('mi', '').replace(/ /g, '');
        console.log("milesCal = " + milesCal);
        var peopleCalNum = parseInt(peopleCal);
        this.numOfPassengers = (peopleCalNum - 1).toString();
        var milesCalNum = parseFloat(milesCal);
        console.log("milesCalNum (double number) = " + milesCalNum);
        var milesCalNumRounded = Math.round(milesCalNum);
        console.log("milesCalNum (double number/Rounded) = " + milesCalNumRounded);
        console.log("Calulate = " + peopleCal + " = passengers \ miles = " + milesCal);
        console.log(milesCalNumRounded + " miles rounded");
        var calulatedPayment = milesCalNumRounded * feePerMile + ((peopleCalNum * feePerPassenger) - feePerPassenger);
        console.log(this.TollFromLoc + " from loc for toll");
        console.log(this.TollToLoc + " to loc for toll");
        if (!this.TollFromLoc.includes('DFW Airport')
            && !this.TollFromLoc.includes('Dallas Love Field Airport')
            && !this.TollToLoc.includes('DFW Airport')
            && !this.TollToLoc.includes('Dallas Love Field Airport')) {
            if (calulatedPayment > 6) {
                console.log(calulatedPayment + " calculated payment is greater then 6");
                this.totalPayment = calulatedPayment + baseFee;
            }
            if (calulatedPayment < 6) {
                this.totalPayment = 0;
                console.log(calulatedPayment + " calculated payment is LESS then 6");
                this.totalPayment = baseFee + calulatedPayment; //+ ((peopleCalNum*5)-5);
            }
            if (milesCalNumRounded >= 20) {
                this.totalPayment = 0;
                console.log(calulatedPayment + " distance in miles is greater then or equal to 20 so toll will be added");
                this.totalPayment = baseFee + calulatedPayment + tollFee;
            }
            if (milesCal.indexOf('ft') > -1) {
                this.totalPayment = 0;
                console.log(milesCal + " milesCal is actually feet so minimum pay is $6");
                this.totalPayment = baseFee + ((peopleCalNum * feePerPassenger) - feePerPassenger);
            }
        }
        else {
            this.totalPayment = 0;
            console.log(calulatedPayment + " Location from or to has Aiport so toll will be added");
            this.totalPayment = baseFee + calulatedPayment + tollFee;
        }
        console.log("Total Payment = " + this.totalPayment);
        this.confirmPmtLoading == false;
    };
    ConfirmInfoComponent.prototype.SubtractFee = function () {
        if (this.subtractCounter == null) {
            this.orginalFee = this.totalPayment;
            console.log(this.orginalFee);
        }
        //if(this.totalPayment > this.orginalFee - 10)
        if (this.totalPayment > this.orginalFee - (this.orginalFee * 0.10)) {
            this.totalPayment = this.totalPayment - 1;
            console.log(this.orginalFee);
            this.subtractCounter++;
        }
        //if(this.totalPayment >= this.orginalFee - 10 || this.totalPayment >= this.orginalFee - 1)
        if (this.totalPayment < this.orginalFee - (this.orginalFee * 0.01)) {
            this.subErrorMsg = true;
        }
        else if (this.totalPayment >= this.orginalFee) {
            this.subErrorMsg = false;
        }
        // if(this.subtractCounter == null)
        //   {
        //     this.orginalFee = this.totalPayment
        //     console.log(this.orginalFee)
        //   }
        // if(this.totalPayment > this.orginalFee - 10)
        //   {
        //     this.subtractCounter = this.totalPayment - (this.orginalFee - 10)
        //   }
        // if (this.subtractCounter != 11 && !(this.totalPayment < this.orginalFee - 10))
        //   {
        //      this.totalPayment = this.totalPayment - 1;
        //      console.log(this.orginalFee)
        //      this.subtractCounter ++;
        //   }
    };
    ConfirmInfoComponent.prototype.AddFee = function () {
        if (this.subtractCounter == null) {
            this.orginalFee = this.totalPayment;
            console.log(this.orginalFee);
        }
        this.subtractCounter++;
        this.totalPayment = this.totalPayment + 1;
        console.log(this.orginalFee);
        //if(this.totalPayment >= this.orginalFee - 10 || this.totalPayment >= this.orginalFee - 1)
        if (this.totalPayment < this.orginalFee - (this.orginalFee * 0.01)) {
            this.subErrorMsg = true;
        }
        else if (this.totalPayment >= this.orginalFee) {
            this.subErrorMsg = false;
        }
    };
    ConfirmInfoComponent.prototype.ConfirmAmount = function () {
        var _this = this;
        var emailAddStoredToken = localStorage.getItem(this.emailaddTokenKey);
        if (emailAddStoredToken) {
            this.emailAddStored = emailAddStoredToken.replace(/["']/g, '').replace(/ $/, "");
            if (this.orginalFee != 0) {
                var emailObj = {
                    email: this.emailAddStored,
                    acceptedAmt: this.totalPayment,
                    OrignalAmt: this.orginalFee
                };
            }
            if (this.orginalFee == 0) {
                var emailObj = {
                    email: this.emailAddStored,
                    acceptedAmt: this.totalPayment,
                    OrignalAmt: this.totalPayment
                };
            }
            var EmailObject = {
                cusEmail: "alishanuta2014@gmail.com",
                subject: "New Ride Request! - Ali-Taxi",
                content: "\n              This is an automatic message. \n              You have a new Customer Ride Request. \n              Please Accept or Decline this request in your Admin Portal.  \n\n                Thank you,\n                From Ali-Taxi Team."
            };
            console.log(emailObj.OrignalAmt + " OrignalAmt");
            console.log(emailObj.acceptedAmt + " acceptedAmt");
        }
        this._customerService.CusAcceptedAmt(emailObj)
            .subscribe(function (result) {
            console.log(result);
            _this.router.navigate(['./RequestSubmitted']);
            _this.sendEmail(EmailObject);
        });
    };
    ConfirmInfoComponent.prototype.sendEmail = function (EmailObject) {
        this._customerService.sendemail(EmailObject)
            .subscribe(function (result) {
            console.log(result);
        });
    };
    ConfirmInfoComponent.prototype.ReturnTolanding = function () {
        var _this = this;
        if (this.NgCusComment != '') {
            var emailAddStoredToken = localStorage.getItem(this.emailaddTokenKey);
            if (emailAddStoredToken) {
                this.emailAddStored = emailAddStoredToken.replace(/["']/g, '').replace(/ $/, "");
                if (this.orginalFee != 0) {
                    var emailObj = {
                        email: this.emailAddStored,
                        CusComment: this.NgCusComment,
                        OrignalAmt: this.orginalFee
                    };
                }
                if (this.orginalFee == 0) {
                    var emailObj = {
                        email: this.emailAddStored,
                        CusComment: this.NgCusComment,
                        OrignalAmt: this.totalPayment
                    };
                }
                console.log(emailObj.CusComment + " CusComment");
            }
            var EmailObject = {
                cusEmail: "alishanuta2014@gmail.com",
                subject: "New Customer Decline - Ali-Taxi",
                content: "\n              This is an automatic message. \n              Recently a Customer filled the ride request form but declined the ride.\n              This is their comment: "
                    + this.NgCusComment + " \n              This is their fee: $" + this.totalPayment +
                    " \n               \n              Thank you,\n              From Ali-Taxi Team."
            };
            this._customerService.CusDeclinedAmt(emailObj)
                .subscribe(function (result) {
                console.log(result);
                _this.router.navigate(['.']);
                _this.sendEmail(EmailObject);
            });
        }
    };
    ConfirmInfoComponent.prototype.CustDeclinedAmt = function () {
        this.custDecAmt = true;
    };
    ConfirmInfoComponent.prototype.log = function (x) {
        console.log(x);
    };
    ConfirmInfoComponent.prototype.onComplete = function () {
        this.router.navigate(['./RequestSubmitted']);
    };
    ConfirmInfoComponent.prototype.onSubmit = function () {
        console.log('form submit clicked..');
    };
    ConfirmInfoComponent.prototype.updateStatus = function (bool, editMode) {
        if (editMode === void 0) { editMode = false; }
        this.mode = bool;
        console.log(this.mode);
        this.editing = editMode;
    };
    ConfirmInfoComponent.prototype.InputValueChange = function (bool) {
        this.firstNameChanged = bool;
    };
    ConfirmInfoComponent.prototype.updateCustomer = function (value, field) {
        switch (field) {
            case 'FirstName':
                this.FirstNameChangeValue = value;
                break;
            case 'LastName':
                this.LastNameChangeValue = value;
                break;
            case 'CustAddress':
                this.CustAddressChangeValue = value;
                break;
            case 'DropOffLoc':
                this.DropOffLocChangeValue = value;
                break;
            case 'EmailAddr':
                this.EmailAddrChangeValue = value;
                break;
            case 'PhoneNum':
                this.PhoneNumChangeValue = value;
                break;
        }
        var result;
        var newCust = {
            CustField: value,
            FieldName: field
        };
        // var changeValue;
        //     switch (field) {
        //           case 'FirstName':
        //            changeValue = this.FirstNameChangeValue;
        //             break; 
        //           case 'LastName':
        //            changeValue = this.LastNameChangeValue;
        //             break; 
        //           case 'CustAddress':
        //            changeValue = this.CustAddressChangeValue;
        //             break; 
        //           case 'DropOffLoc':
        //            changeValue = this.DropOffLocChangeValue;
        //             break; 
        //           case 'EmailAddr':
        //            changeValue = this.EmailAddrChangeValue;
        //             break; 
        //           case 'PhoneNum':
        //            changeValue = this.PhoneNumChangeValue;
        //             break; 
        //   }
        result = this._customerService.UpdateOneCusField(newCust, this.page);
        result.subscribe(function (x) {
            //this.updateValue.push(value);
            //this.updateValue.push(newCust);
        });
        this.FirstNameUI = value;
        console.log(value);
        console.log(result + " - THIS IS THE RESULT");
        this.updateStatus(true);
        if (value != '') {
            this.updated = true;
        }
    };
    ConfirmInfoComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'ConfirmInfo',
            templateUrl: 'NewConfirmInfo.component.html',
            styleUrls: ['ConfirmInfo.component.css']
        }), 
        __metadata('design:paramtypes', [router_1.Router, customer_service_1.CustomerService, router_1.ActivatedRoute, http_1.Http])
    ], ConfirmInfoComponent);
    return ConfirmInfoComponent;
}());
exports.ConfirmInfoComponent = ConfirmInfoComponent;
//# sourceMappingURL=ConfirmInfo.component.js.map