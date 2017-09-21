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
//import * as moment from 'moment/moment';
var moment = require('moment-timezone');
var customer_service_1 = require('../services/customer.service');
var AdminPortalComponent = (function () {
    function AdminPortalComponent(router, _customerService, changeDetectorRef) {
        this.router = router;
        this._customerService = _customerService;
        this.changeDetectorRef = changeDetectorRef;
        this.p = 1; // pagination
        this.initialized = false;
        this.inputName = '';
        this.pageStart = 0;
        this.pageEnd = 100;
        this.pageHeight = 30;
        this.pageBuffer = 100;
        this.initialized = false;
        this.Accept = "Accept Request";
        this.RideAccepted = true;
        this.deleting = false;
        this.customer = [];
        this.fullPath = 'app/assets/Preloader_8.gif'; // since you are running npm run tsc --w from "cd documents/projects/meantodos/client" then after client it's "app" then "assets"
        this.showCustInfo = false;
        this.UpdateFees = false;
        this.newPricingSaved = false;
        this.DeclineReq = false;
        this.NgDriverComment = '';
        this.emailOfDeclineRequest = '';
        this.indexOfDeclineRequest = null;
        this.yesterdayDate = '';
    }
    AdminPortalComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.GetYesterdayDate();
        this.RunPastRequestUpdate();
        this._customerService.getRidePaymentDetails()
            .subscribe(function (paymentinfo) {
            _this.RidePaymentDetails = paymentinfo;
            _this.ngFeePerMile = _this.RidePaymentDetails[0].FeePerMile;
            _this.ngFeePerPassenger = _this.RidePaymentDetails[0].FeePerPassenger;
            _this.ngBaseFee = _this.RidePaymentDetails[0].BaseFee;
            _this.initialized = false;
        });
        //this.getMyPicture();
        //     setTimeout(() => {
        // this.initialized = true;
        // }, 3000)
        this._customerService.getAllCustomers()
            .subscribe(function (customer) {
            _this.customer = customer;
            console.log(_this.customer);
            _this.initialized = true;
        });
    };
    //     input {
    //     width: 250px;
    //     padding: 5px;
    //   }
    // form {
    //       width: 40%;
    //       margin-right: 30%;
    //       margin-left: 30%;
    //       background-color: white
    //   }
    // .app-title {     
    //       width: 40%;
    //       margin-right: 30%;
    //       margin-left: 30%;
    //       background-color: white
    //   }
    // .alert-danger {
    //   width: 250px;
    //   padding: 5px;
    // }
    //     getMyPicture(){
    //    this.fullPath = "../assets/"+ this.myPicture;
    //  }
    AdminPortalComponent.prototype.onScroll = function (event, doc) {
        var scrollTop = event.target.scrollTop;
        var scrollHeight = event.target.scrollHeight;
        var offsetHeight = event.target.offsetHeight;
        var scrollPosition = scrollTop + offsetHeight;
        var scrollTreshold = scrollHeight - this.pageHeight;
        if (scrollPosition > scrollTreshold) {
            this.pageEnd += this.pageBuffer;
        }
    };
    AdminPortalComponent.prototype.GetYesterdayDate = function () {
        var newDate = new Date(Date.now() - (86400000 * 2));
        this.yesterdayDate = newDate.toISOString().slice(0, 10);
        console.log(this.yesterdayDate);
    };
    AdminPortalComponent.prototype.RunPastRequestUpdate = function () {
        var _this = this;
        var momentToday = moment().tz("America/Chicago").format('YYYY-MM-DD'); // Texas has the same time zone as Chicago
        console.log(momentToday + " - Today using moment");
        var TodayDate = {
            date: momentToday
        };
        this._customerService.UpdateToPastRequest(TodayDate)
            .subscribe(function (recordsupdated) {
            _this.pastRequestUpdated = recordsupdated;
            console.log("number of records updated to past requests:");
            console.log(recordsupdated);
            _this.initialized = false;
        });
    };
    AdminPortalComponent.prototype.OpenRideFees = function () {
        this.UpdateFees = true;
        console.log(this.UpdateFees);
    };
    AdminPortalComponent.prototype.OpenCustomerRequests = function () {
        this.UpdateFees = false;
        console.log(this.UpdateFees);
    };
    AdminPortalComponent.prototype.UpdateRideFees = function (feeMile, feePassenger, baseFee) {
        var _this = this;
        if (this.ngFeePerMile.toString() != '' && this.ngFeePerPassenger.toString() != '' && this.ngBaseFee.toString() != '') {
            var Pricing = {
                FeePerMile: this.ngFeePerMile,
                FeePerPassenger: this.ngFeePerPassenger,
                BaseFee: this.ngBaseFee
            };
            console.log(Pricing);
            this._customerService.UpdateRidePricing(Pricing)
                .subscribe(function (paymentinfo) {
                _this.newPricingSaved = true;
            });
        }
    };
    AdminPortalComponent.prototype.onAccept = function (index, CustID) {
        var _this = this;
        this.deleting = true;
        var result;
        var NewBool = {
            obj: true,
            email: this.customer[index].EmailAddr
        };
        var EmailObject = {
            cusEmail: this.customer[index].EmailAddr,
            subject: "Congrats, Your Ride Request was Accepted! - Ali-Taxi",
            content: "\n              This is an automatic message. \n              Congrats, Your Ride Request was Accepted!\n              Your driver will pick you up on: "
                + this.customer[index].PickUpDate.replace('T00:00:00.000Z', '') +
                "\n              At: " + this.customer[index].PickUpTime +
                "\n              From Your Location: " + this.customer[index].CustAddress +
                "\n\n              Thank you,\n              From Ali-Taxi Team."
        };
        console.log("NewBool");
        console.log(NewBool);
        result = this._customerService.UpdateRequestAccepted(NewBool);
        result.subscribe(function (x) {
            _this.deleting = false;
            _this.sendEmail(EmailObject);
        });
        setTimeout(function () {
            _this.initialized = true;
        }, 2000);
    };
    AdminPortalComponent.prototype.DeclineCusReq = function (index) {
        this.DeclineReq = true;
        this.emailOfDeclineRequest = this.customer[index].EmailAddr;
        this.indexOfDeclineRequest = index;
    };
    AdminPortalComponent.prototype.DeclineReqReason = function () {
        var _this = this;
        console.log(this.NgDriverComment);
        console.log(this.emailOfDeclineRequest);
        console.log(this.indexOfDeclineRequest);
        this.deleting = true;
        var result;
        var DeclineCustReqObj = {
            cusEmail: this.emailOfDeclineRequest,
            driverComment: this.NgDriverComment
        };
        var EmailObject = {
            cusEmail: this.emailOfDeclineRequest,
            subject: "Driver Declined your Ride Request! - Ali-Taxi",
            content: "\n              This is an automatic message. \n              We are very sorry.. The driver has declined your ride request for this reason: "
                + this.NgDriverComment +
                "\n              Please submit another request at anytime. Again we apologize.\n\n              Thank you,\n              From Ali-Taxi Team."
        };
        result = this._customerService.DeclineCusReq(DeclineCustReqObj);
        result.subscribe(function (x) {
            _this.deleting = false;
            _this.customer.splice(_this.indexOfDeclineRequest, 1);
            _this.DeclineReq = false;
            _this.sendEmail(EmailObject);
        });
        setTimeout(function () {
            _this.initialized = true;
        }, 2000);
    };
    AdminPortalComponent.prototype.sendEmail = function (EmailObject) {
        this._customerService.sendemail(EmailObject)
            .subscribe(function (result) {
            console.log(result);
        });
    };
    AdminPortalComponent.prototype.deleteItem = function (index, CustID) {
        var _this = this;
        this.deleting = true;
        var result;
        var DeleteObj = {
            custID: CustID
        };
        console.log(DeleteObj.custID + " delete object cust id");
        result = this._customerService.DeleteCustomer(DeleteObj);
        result.subscribe(function (x) {
            _this.deleting = false;
        });
        console.log(index);
        this.customer.splice(index, 1);
        setTimeout(function () {
            _this.initialized = true;
        }, 2000);
    };
    AdminPortalComponent.prototype.ShowCustInfo = function (index) {
        this.Info_FirstName = this.customer[index].FirstName;
        this.Info_LastName = this.customer[index].LastName;
        this.Info_Email = this.customer[index].EmailAddr;
        this.Info_Phone = this.customer[index].PhoneNum.toString();
        this.showCustInfo = true;
    };
    AdminPortalComponent.prototype.CloseCustInfo = function () {
        this.showCustInfo = false;
        this.Info_FirstName = "";
        this.Info_LastName = "";
        this.Info_Email = "";
        this.Info_Phone = null;
    };
    AdminPortalComponent.prototype.log = function (x) {
        console.log(x);
    };
    AdminPortalComponent.prototype.onComplete = function () {
        //this.router.navigate(['./RequestSubmitted']);
        //this.router.navigate(['./ConfirmInfo'], { queryParams: { page: this.sum } });
    };
    AdminPortalComponent.prototype.onSubmit = function () {
        console.log('form submit clicked..');
    };
    AdminPortalComponent.prototype.LogoutAdmin = function () {
        localStorage.removeItem('app_token');
        this.router.navigate(['./AdminLogin']);
    };
    AdminPortalComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'AdminPortal',
            templateUrl: 'NewAdminPortal.component.html',
            styleUrls: ['AdminPortal.component.css']
        }), 
        __metadata('design:paramtypes', [router_1.Router, customer_service_1.CustomerService, core_1.ChangeDetectorRef])
    ], AdminPortalComponent);
    return AdminPortalComponent;
}());
exports.AdminPortalComponent = AdminPortalComponent;
//# sourceMappingURL=AdminPortal.component.js.map