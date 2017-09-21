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
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
var CustomerService = (function () {
    function CustomerService(_http) {
        this._http = _http;
    }
    CustomerService.prototype.getSavedCustomerById = function (id) {
        return this._http.get('/api/v2/getsaveddata/' + id)
            .map(function (res) { return res.json(); });
    };
    CustomerService.prototype.getCustomer = function () {
        return this._http.get('/api/v2/customer')
            .map(function (res) { return res.json(); });
    };
    CustomerService.prototype.getAllCustomers = function () {
        return this._http.get('/api/v2/allcustomers')
            .map(function (res) { return res.json(); });
    };
    CustomerService.prototype.CheckCustId = function (id) {
        return this._http.get('/api/v2/checkcustid/' + id)
            .map(function (res) { return res.json(); });
    };
    CustomerService.prototype.AddReview = function (ReviewObj) {
        console.log(ReviewObj.comment);
        return this._http.post('/api/v2/addnewreview', ReviewObj)
            .map(function (res) { return res.json(); });
    };
    CustomerService.prototype.DeleteReview = function (ExistingComment) {
        console.log(ExistingComment.Review);
        return this._http.post('/api/v2/deletereview', ExistingComment)
            .map(function (res) { return res.json(); });
    };
    CustomerService.prototype.getAllReviews = function () {
        return this._http.get('/api/v2/getreviews')
            .map(function (res) { return res.json(); });
    };
    // get current ride payment info
    CustomerService.prototype.getRidePaymentDetails = function () {
        return this._http.get('/api/v2/ridepaymentinfo')
            .map(function (res) { return res.json(); });
    };
    CustomerService.prototype.UpdateRequestToDeclined = function (emailObj) {
        return this._http.post('/api/v2/modifycusrequest', emailObj)
            .map(function (res) { return res.json(); });
    };
    CustomerService.prototype.sendemail = function (EmailObj) {
        console.log(EmailObj.cusEmail);
        console.log(EmailObj.subject);
        console.log(EmailObj.content);
        return this._http.post('/api/v2/sendemail', EmailObj)
            .map(function (res) { return res.json(); });
    };
    CustomerService.prototype.CusAcceptedAmt = function (email) {
        console.log(email + ' inside customer service dot ts Customer Accepted Amount');
        console.log(email.acceptedAmt + " acceptedAmt");
        return this._http.post('/api/v2/cusacceptedamt', email)
            .map(function (res) { return res.json(); });
    };
    // update payment info
    CustomerService.prototype.UpdateRidePricing = function (Pricing) {
        console.log(Pricing.FeePerMile + " -FeePerMile");
        return this._http.post('/api/v2/updateridepaymentinfo', Pricing)
            .map(function (res) { return res.json(); });
    };
    CustomerService.prototype.UpdateToPastRequest = function (TodayDate) {
        return this._http.post('/api/v2/updatepastrequest', TodayDate)
            .map(function (res) { return res.json(); });
    };
    CustomerService.prototype.CusDeclinedAmt = function (email) {
        console.log(email + ' inside customer service dot ts Customer Accepted Amount');
        console.log(email.acceptedAmt + " acceptedAmt");
        return this._http.post('/api/v2/cusdeclinedamt', email)
            .map(function (res) { return res.json(); });
    };
    CustomerService.prototype.DeclineCusReq = function (DeclineCustReqObj) {
        return this._http.post('/api/v2/driverdeclined', DeclineCustReqObj)
            .map(function (res) { return res.json(); });
    };
    CustomerService.prototype.getSavedCustomer = function (id) {
        return this._http.get('/api/v2/savedcustomer/' + id)
            .map(function (res) { return res.json(); });
    };
    CustomerService.prototype.getExisitingEmail = function (id) {
        console.log(id + ' inside customer service dot ts');
        return this._http.get('/api/v2/getemail/' + id)
            .map(function (res) { return res.json(); });
    };
    CustomerService.prototype.getGoogleDist = function (id) {
        console.log(id + ' inside customer service dot ts GOOGLE DISTANCE');
        return this._http.get('/api/v2/getgoogledistance/' + id)
            .map(function (res) { return res.json(); });
    };
    CustomerService.prototype.getAdminUser = function (cust) {
        console.log(cust);
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post('/api/v2/getadmin', JSON.stringify(cust), { headers: headers })
            .map(function (res) { return res.json(); });
    };
    CustomerService.prototype.saveCustomer = function (cust) {
        console.log(cust + ' inside customer service dot ts correctly');
        return this._http.post('/api/v2/addcust', cust)
            .map(function (res) { return res.json(); });
    };
    CustomerService.prototype.saveOneCus = function (cust) {
        console.log(cust + 'inside customer service dot ts');
        return this._http.post('/api/v2/addonecust', cust)
            .map(function (res) { return res.json(); });
    };
    CustomerService.prototype.UpdateOneCusField = function (value, id) {
        console.log(value + ' reached update value method inside customer service dot ts');
        return this._http.put('/api/v2/updatecustfield/' + id, value)
            .map(function (res) { return res.json(); });
    };
    CustomerService.prototype.UpdateRequestAccepted = function (value) {
        console.log(value + ' reached update value method inside customer service dot ts');
        return this._http.put('/api/v2/updaterequestaccept', value)
            .map(function (res) { return res.json(); });
    };
    CustomerService.prototype.DeleteCustomer = function (value) {
        console.log(value.custID + ' reached update value method inside customer service dot ts');
        return this._http.put('/api/v2/deletecustomer', value)
            .map(function (res) { return res.json(); });
    };
    CustomerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], CustomerService);
    return CustomerService;
}());
exports.CustomerService = CustomerService;
//# sourceMappingURL=customer.service.js.map