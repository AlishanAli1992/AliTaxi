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
var Bool_1 = require('../Bool');
var RequestRideComponent = (function () {
    function RequestRideComponent(router, _customerService, mapsAPILoader, ngZone) {
        this.router = router;
        this._customerService = _customerService;
        this.mapsAPILoader = mapsAPILoader;
        this.ngZone = ngZone;
        this.mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]; // for phone number
        // store customer data in cookies
        this.fromLocTokenKey = 'app_token_confirmInfo_from';
        this.toLocTokenKey = 'app_token_confirmInfo_to';
        this.passengersTokenKey = 'app_token_confirmInfo_passengers';
        this.firstnameTokenKey = 'app_token_confirmInfo_firstname';
        this.lastnameTokenKey = 'app_token_confirmInfo_lastname';
        this.emailaddTokenKey = 'app_token_confirmInfo_emailadd';
        this.pickedDateTokenKey = 'app_token_confirmInfo_pickedDate';
        this.pickUpTimeTokenKey = 'app_token_confirmInfo_pickUpTime';
        this.phoneNumTokenKey = 'app_token_confirmInfo_phoneNum';
        this.tokenKey = 'app_token';
        this.PickUpChange = false;
        this.dropOffChange = false;
        this.pageStart = 0;
        this.pageEnd = 100;
        this.pageHeight = 30;
        this.pageBuffer = 100;
        this.sum = Math.floor(Math.random() * 1000) + 1; //Where: 1 is the start number and 6 is the number of possible results (1 + start (6) - end (1))
        this.appName = 'Future-Taxi-Ride';
        this.errorMsg = false;
        this.NgfirstName = "";
        this.NgLastName = "";
        this.NgPickUpLoc = "";
        this.NgDropOffLoc = "";
        this.NgPhoneNum = "";
        this.Ngemail = "";
        this.NgreEmail = "";
        this.NgDate = '';
        this.NgTime = '';
        this.NgPassengers = '';
        this.NgCustReviews = '';
        this.custExist = new Bool_1.Bool;
        //this.custEmail = new CustEmail;
        this.clearSearch = false;
        this.pauseChecking = true;
        this.enableDeleteComments = false;
        this.nonCustomer = false;
        this.FullCusName = '';
        this.valueChange = new core_1.EventEmitter();
    }
    RequestRideComponent.prototype.ngOnInit = function () {
        var _this = this;
        var firstNameStoredToken = localStorage.getItem(this.firstnameTokenKey);
        if (!firstNameStoredToken) {
            console.log("New Customer");
        }
        if (firstNameStoredToken) {
            this.firstNameStored = firstNameStoredToken.replace(/["']/g, '');
            console.log("Existing Customer returned: " + firstNameStoredToken);
            this.NgfirstName = this.firstNameStored;
            this.clearSearch = true;
        }
        var lastNameStoredToken = localStorage.getItem(this.lastnameTokenKey);
        if (lastNameStoredToken) {
            this.lastNameStored = lastNameStoredToken.replace(/["']/g, '');
            this.NgLastName = this.lastNameStored;
        }
        var toLocStoredToken = localStorage.getItem(this.toLocTokenKey);
        if (toLocStoredToken) {
            this.toLocStored = toLocStoredToken.replace(/["']/g, '');
            this.NgDropOffLoc = this.toLocStored;
        }
        var fromLocStoredToken = localStorage.getItem(this.fromLocTokenKey);
        if (fromLocStoredToken) {
            this.fromLocStored = fromLocStoredToken.replace(/["']/g, '');
            this.NgPickUpLoc = this.fromLocStored;
        }
        var passengersStoredToken = localStorage.getItem(this.passengersTokenKey);
        if (passengersStoredToken) {
            this.passengersStored = passengersStoredToken.replace(/["']/g, '');
            this.NgPassengers = this.passengersStored;
        }
        var emailAddStoredToken = localStorage.getItem(this.emailaddTokenKey);
        if (emailAddStoredToken) {
            this.emailAddStored = emailAddStoredToken.replace(/["']/g, '');
            // this.Ngemail = this.emailAddStored
            // this.NgreEmail = this.emailAddStored
            this.Ngemail = "";
            this.NgreEmail = "";
        }
        var pickedDateStoredToken = localStorage.getItem(this.pickedDateTokenKey);
        if (pickedDateStoredToken) {
            this.pickedDateStored = pickedDateStoredToken.replace(/["']/g, '');
            this.NgDate = this.pickedDateStored;
        }
        var pickUpTimeStoredToken = localStorage.getItem(this.pickUpTimeTokenKey);
        if (pickUpTimeStoredToken) {
            this.pickUpTimeStored = pickUpTimeStoredToken.replace(/["']/g, '');
            this.NgTime = this.pickUpTimeStored;
        }
        var phoneNumStoredToken = localStorage.getItem(this.phoneNumTokenKey);
        if (phoneNumStoredToken) {
            this.phoneNumStored = phoneNumStoredToken.replace(/["']/g, '');
            this.NgPhoneNum = this.phoneNumStored;
        }
        // Load all customer Reviews
        this.GetAllComments();
        var storedToken = localStorage.getItem(this.tokenKey);
        if (!storedToken) {
            console.log("no token found");
            this.enableDeleteComments = false;
        }
        else {
            console.log(storedToken);
            if (storedToken.indexOf("mehboob@mail.commehboob")) {
                this.enableDeleteComments = true;
            }
        }
        // GOOGLE MAPS AUTOCOMPLETE
        this.mapsAPILoader.load().then(function () {
            var autocomplete = new google.maps.places.Autocomplete(_this.searchElement.nativeElement, { types: ["address"] });
            autocomplete.addListener("place_changed", function () {
                _this.ngZone.run(function () {
                    var place = autocomplete.getPlace();
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }
                });
            });
        });
        this.mapsAPILoader.load().then(function () {
            var autocomplete = new google.maps.places.Autocomplete(_this.searchElement2.nativeElement, { types: ["address"] });
            autocomplete.addListener("place_changed", function () {
                _this.ngZone.run(function () {
                    var place = autocomplete.getPlace();
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }
                });
            });
        });
        //Pick Up Date
        this.value = [];
        for (var i = 0; i < 10;) {
            var newDate = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
            this.dateString = newDate.toISOString().slice(0, 10);
            console.log(this.dateString);
            this.value.push(this.dateString);
            i++;
            console.log();
        }
        //Pick Up Time
        this.timeValues = [];
        this.timeString = "12:00pm";
        this.timeValues.push(this.timeString);
        console.log(this.timeString);
        this.timeString = "12:15pm";
        this.timeValues.push(this.timeString);
        console.log(this.timeString);
        this.timeString = "12:30pm";
        this.timeValues.push(this.timeString);
        console.log(this.timeString);
        this.timeString = "12:45pm";
        this.timeValues.push(this.timeString);
        console.log(this.timeString);
        for (var i = 1; i < 13;) {
            this.timeString = i + ":00pm";
            this.timeValues.push(this.timeString.toString());
            console.log(this.timeString);
            this.timeString = i + ":15pm";
            this.timeValues.push(this.timeString.toString());
            console.log(this.timeString);
            this.timeString = i + ":30pm";
            this.timeValues.push(this.timeString.toString());
            console.log(this.timeString);
            this.timeString = i + ":45pm";
            this.timeValues.push(this.timeString.toString());
            console.log(this.timeString);
            i++;
        }
        for (var i = 1; i < 12;) {
            this.timeString = i + ":00am";
            this.timeValues.push(this.timeString.toString());
            console.log(this.timeString);
            this.timeString = i + ":15am";
            this.timeValues.push(this.timeString.toString());
            console.log(this.timeString);
            this.timeString = i + ":30am";
            this.timeValues.push(this.timeString.toString());
            console.log(this.timeString);
            this.timeString = i + ":45am";
            this.timeValues.push(this.timeString.toString());
            console.log(this.timeString);
            i++;
        }
        console.log(this.timeValues);
        this.PassengersList = ['1', '2', '3', '4', '5'];
    };
    RequestRideComponent.prototype.FillLocation = function (event) {
        if (this.NgPickUpLoc.toUpperCase() == 'DFW') {
            this.NgPickUpLoc = 'DFW Airport, TX';
        }
        if (this.NgPickUpLoc.toUpperCase() == 'DALLAS FORT WORTH') {
            this.NgPickUpLoc = 'DFW Airport, TX';
        }
        if (this.NgPickUpLoc.toUpperCase() == 'DALLAS LOVE FIELD') {
            this.NgPickUpLoc = 'Dallas Love Field Airport, TX';
        }
        // if(this.NgPickUpLoc.toUpperCase() == 'DAL'){
        //   this.NgPickUpLoc = 'Dallas Love Field, TX'
        // }
        if (this.NgDropOffLoc.toUpperCase() == 'DFW') {
            this.NgDropOffLoc = 'DFW Airport, TX';
        }
        if (this.NgDropOffLoc.toUpperCase() == 'DALLAS FORT WORTH') {
            this.NgDropOffLoc = 'DFW Airport, TX';
        }
        if (this.NgDropOffLoc.toUpperCase() == 'DALLAS LOVE FIELD') {
            this.NgDropOffLoc = 'Dallas Love Field Airport, TX';
        }
        // if(this.NgDropOffLoc.toUpperCase() == 'DAL'){
        //   this.NgDropOffLoc = 'Dallas Love Field, TX'
        // }
        //DAL
    };
    RequestRideComponent.prototype.FillLocationOnChange = function (event) {
        if (this.NgPickUpLoc.toUpperCase().includes('DFW')) {
            this.NgPickUpLoc = 'DFW Airport, TX';
        }
        if (this.NgPickUpLoc.toUpperCase().includes('DALLAS FORT WORTH')) {
            this.NgPickUpLoc = 'DFW Airport, TX';
        }
        if (this.NgPickUpLoc.toUpperCase().includes('DALLAS LOVE FIELD')) {
            this.NgPickUpLoc = 'Dallas Love Field Airport, TX';
        }
        // if(this.NgPickUpLoc.toUpperCase().includes('DAL')){
        //     this.NgPickUpLoc = 'Dallas Love Field, TX'
        //   }
        if (this.NgDropOffLoc.toUpperCase().includes('DFW')) {
            this.NgDropOffLoc = 'DFW Airport, TX';
        }
        //DALLAS FORT WORTH
        if (this.NgDropOffLoc.toUpperCase().includes('DALLAS FORT WORTH')) {
            this.NgDropOffLoc = 'DFW Airport, TX';
        }
        if (this.NgDropOffLoc.toUpperCase().includes('DALLAS LOVE FIELD')) {
            this.NgDropOffLoc = 'Dallas Love Field Airport, TX';
        }
        // if(this.NgDropOffLoc.toUpperCase().includes('DAL')){
        //     this.NgDropOffLoc = 'Dallas Love Field, TX'
        //   }
    };
    RequestRideComponent.prototype.GetAllComments = function () {
        var _this = this;
        var result = this._customerService.getAllReviews();
        result.subscribe(function (reviews) {
            _this.allCustomerReviews = reviews;
            console.log(reviews);
            console.log(_this.allCustomerReviews);
        });
    };
    RequestRideComponent.prototype.addComment = function (Comment) {
        var _this = this;
        var firstNameStoredToken = localStorage.getItem(this.firstnameTokenKey);
        if (firstNameStoredToken && firstNameStoredToken != 'undefined') {
            console.log(this.firstNameStored + " " + this.lastNameStored);
            this.FullCusName = this.firstNameStored + " " + this.lastNameStored;
            var result;
            var TodayDate = new Date(Date.now()).toISOString().slice(0, 10);
            var ReviewObj = {
                comment: Comment,
                CommentDate: TodayDate,
                FullCustomerName: this.FullCusName
            };
            var newReviews = {
                Reviews: Comment.toString(),
                CommentDate: TodayDate,
                FullCusName: this.FullCusName
            };
            console.log(this.allCustomerReviews);
            if (Comment != '' && Comment != null) {
                console.log(ReviewObj.comment);
                this.allCustomerReviews.unshift(newReviews); // add comment to the array
                result = this._customerService.AddReview(ReviewObj); // add comment to DB
                result.subscribe(function (x) {
                    console.log("comment sent to DB");
                    _this.NgCustReviews = '';
                });
            }
        }
        else {
            this.nonCustomer = true;
        }
    };
    RequestRideComponent.prototype.DeleteComment = function (Comment, index) {
        var result;
        var ExistingComment = {
            Review: Comment
        };
        this.allCustomerReviews.splice(index, 1); // add comment to the array
        result = this._customerService.DeleteReview(ExistingComment); // add comment to DB
        result.subscribe(function (x) {
            console.log("comment Deleted in DB");
        });
    };
    RequestRideComponent.prototype.clearPreviousSearch = function () {
        this.errorMsg = false;
        this.NgfirstName = "";
        this.NgLastName = "";
        this.NgPickUpLoc = "";
        this.NgDropOffLoc = "";
        this.NgPhoneNum = "";
        this.Ngemail = "";
        this.NgreEmail = "";
        this.NgDate = '';
        this.NgTime = '';
        this.NgPassengers = '';
        this.clearSearch = false;
    };
    RequestRideComponent.prototype.PhoneNumChange = function () {
        //if (this.NgPhoneNum.length > 10)
        this.NgPhoneNum.replace('(', '').replace(')', '').replace('-', '');
        console.log(this.NgPhoneNum);
    };
    // UpdatePhoneUI(event){
    //   var k = event.keyCode; 
    //   if(k.length >= 3)
    //     {
    //       console.log(k)
    //       console.log(k.length)
    //       this.NgPhoneNum = "("+this.NgPhoneNum+")"
    //     }
    // }
    RequestRideComponent.prototype.onScroll = function (event, doc) {
        var scrollTop = event.target.scrollTop;
        var scrollHeight = event.target.scrollHeight;
        var offsetHeight = event.target.offsetHeight;
        var scrollPosition = scrollTop + offsetHeight;
        var scrollTreshold = scrollHeight - this.pageHeight;
        if (scrollPosition > scrollTreshold) {
            this.pageEnd += this.pageBuffer;
        }
    };
    //style="display: inline-block; float: none;"
    RequestRideComponent.prototype.omit_special_char = function (event) {
        var k;
        k = event.charCode; //         k = event.keyCode;  (Both can be used)
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
    };
    RequestRideComponent.prototype.emailDupCheck = function (email) {
        var _this = this;
        this.custEmail = [];
        console.log(email + " This is the email we are searching for in the DB");
        this.pauseChecking = true;
        var NewEmail = {
            EmailAddr: email
        };
        var result = this._customerService.getExisitingEmail(email);
        result.subscribe(function (existingemail) {
            // if(existingemail != null)
            //   {
            _this.custEmail.push(existingemail);
            console.log(_this.custEmail);
            //   }
            // else
            //   {
            //     this.custEmailNonExi = true;
            //   }
            _this.pauseChecking = false;
        });
    };
    RequestRideComponent.prototype.ReturnTolanding = function () {
        this.router.navigate(['./RequestSubmitted']);
    };
    RequestRideComponent.prototype.select = function (value) {
        this.valueChange.emit(value);
    };
    RequestRideComponent.prototype.addDatCust = function (nameText) {
        var _this = this;
        var result;
        var name = {
            custName: nameText
        };
        console.log(nameText + 'inside request ride component dot ts');
        result = this._customerService.saveOneCus(name);
        //console.log(result + 'the result of customerservice dot save one cus')
        result.subscribe(function (x) {
            _this.Datname.push(name);
            //console.log(this.Datname + 'this is name dot ts variable output')
        });
    };
    RequestRideComponent.prototype.addNewCustomer = function (firstname, lastname, pickUpLoc, dropoffloc, phonenum, emailadd, pickedDate, pickUpTime, numOfPassengers) {
        var _this = this;
        localStorage.clear(); // clear old customer data from local storage so we can save new customer data!
        // this.custEmail = [];
        // Replace special characters and spaces in phone number for API call
        //console.log(phonenum);
        var replacePhone = phonenum.replace(/[()]/g, '').replace(/[-]/g, '').replace(' ', '');
        //console.log(replacePhone);
        var newPhonenum = Number(replacePhone);
        //console.log(newPhonenum);
        // create empty object so we can insert the new data
        this.customer = [];
        //console.log(pickedDate + "  this is the picked date in the add new cust method")
        //console.log(this.sum + " OUTSIDE - Sum Number")
        // create a temporary variable
        var result;
        // create a new customer object and store the data inserted into the parameters coming from the front-end
        var newCust = {
            CustID: this.sum,
            FirstName: firstname,
            LastName: lastname,
            CustAddress: pickUpLoc,
            DropOffLoc: dropoffloc,
            PhoneNum: newPhonenum,
            EmailAddr: emailadd,
            PickUpDate: pickedDate,
            PickUpTime: pickUpTime,
            NumOfPassengers: numOfPassengers
        };
        //console.log(numOfPassengers+ ' ' +pickUpTime+ ' ' +newCust.CustID+ ' ' +firstname+'  '+lastname+ '  ' +pickUpLoc+ '  ' +dropoffloc+ '  ' +newPhonenum+ '  ' +emailadd+ ' this is the newCust pick up date - ' +newCust.PickUpDate )
        // add cookies (of all the data user entered in the front-end) to users local file
        localStorage.setItem(this.fromLocTokenKey, JSON.stringify(pickUpLoc));
        localStorage.setItem(this.toLocTokenKey, JSON.stringify(dropoffloc));
        localStorage.setItem(this.passengersTokenKey, JSON.stringify(numOfPassengers));
        localStorage.setItem(this.firstnameTokenKey, JSON.stringify(firstname));
        localStorage.setItem(this.lastnameTokenKey, JSON.stringify(lastname));
        localStorage.setItem(this.emailaddTokenKey, JSON.stringify(emailadd));
        localStorage.setItem(this.pickedDateTokenKey, JSON.stringify(pickedDate));
        localStorage.setItem(this.pickUpTimeTokenKey, JSON.stringify(pickUpTime));
        localStorage.setItem(this.phoneNumTokenKey, JSON.stringify(newPhonenum));
        // Call the saveCustomer API Service and pass the new customer object
        result = this._customerService.saveCustomer(newCust);
        result.subscribe(function (x) {
            _this.customer.push(x);
            // Clear the method's parameters as the data is already passed to the API call
            firstname = '';
            lastname = '';
            pickUpLoc = '';
            dropoffloc = '';
            phonenum = null;
            emailadd = '';
            pickedDate = '';
            pickUpTime = '';
            numOfPassengers = '';
            _this.onComplete(); // method to go to next page (confirm request page)
        }); // end of API call
        // while(!result)
        //   {
        //     console.log("waiting for service to render");
        //   }
        // if(result)
        //   {
        //   console.log(result + " this is the result from service");
        //     this.onComplete();
        //   }
        // Create New CustID 
        this.sum = Math.floor(Math.random() * 1000) + 1;
        //console.log(this.sum + " this is the new CustId after saving the current customer")
    };
    RequestRideComponent.prototype.log = function (x) {
        console.log(x);
        console.log(this.searchElement);
    };
    RequestRideComponent.prototype.onComplete = function () {
        //this.router.navigate(['./RequestSubmitted']);
        this.router.navigate(['./ConfirmInfo'], { queryParams: { page: this.sum } });
    };
    RequestRideComponent.prototype.onSubmit = function () {
        console.log('form submit clicked..');
    };
    RequestRideComponent.prototype.AdminPortal = function () {
        this.router.navigate(['./AdminPortal']);
    };
    __decorate([
        core_1.ViewChild('search'), 
        __metadata('design:type', core_1.ElementRef)
    ], RequestRideComponent.prototype, "searchElement", void 0);
    __decorate([
        // GOOGLE MAPS
        core_1.ViewChild('searchnew'), 
        __metadata('design:type', core_1.ElementRef)
    ], RequestRideComponent.prototype, "searchElement2", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], RequestRideComponent.prototype, "values", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], RequestRideComponent.prototype, "timeValues", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], RequestRideComponent.prototype, "value", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], RequestRideComponent.prototype, "PassengersList", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], RequestRideComponent.prototype, "valueChange", void 0);
    RequestRideComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'RequestRide',
            templateUrl: 'NewRequestRide2.component.html',
            styleUrls: ['RequestRide.component.css']
        }), 
        __metadata('design:paramtypes', [router_1.Router, customer_service_1.CustomerService, core_2.MapsAPILoader, core_1.NgZone])
    ], RequestRideComponent);
    return RequestRideComponent;
}());
exports.RequestRideComponent = RequestRideComponent;
// input {
//     width: 250px;
//     padding: 5px;
//   }
// select {
//     width: 250px;
//     padding: 5px;
// }
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
//# sourceMappingURL=RequestRide.component.js.map