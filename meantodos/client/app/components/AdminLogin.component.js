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
var common_1 = require('@angular/common');
var router_1 = require('@angular/router');
var customer_service_1 = require('../services/customer.service');
var AdminUser_1 = require('../AdminUser');
var AdminLoginComponent = (function () {
    function AdminLoginComponent(router, _customerService, location) {
        var _this = this;
        this.router = router;
        this._customerService = _customerService;
        this.tokenKey = 'app_token';
        location.onPopState(function () {
            _this.router.navigate(['.']);
            console.log('pressed back!');
        });
        this.NgUsername = "";
        this.NgPassword = '';
        this.adminUser = new AdminUser_1.AdminUser();
        this.wrongCred = false;
    }
    AdminLoginComponent.prototype.ngOnInit = function () {
        var storedToken = localStorage.getItem(this.tokenKey);
        if (!storedToken) {
            console.log("no token found");
        }
        else {
            console.log(storedToken);
            //if(storedToken.indexOf("SignedIn"))
            if (storedToken.indexOf(this.adminUsername + this.adminPassword)) {
                this.AdminPortal();
            }
        }
    };
    AdminLoginComponent.prototype.LoginAdmin = function (username, password) {
        var _this = this;
        console.log(username);
        console.log(password);
        this.serviceLoading = true;
        var result;
        var adminCred = {
            Username: username,
            Password: password
        };
        console.log(adminCred);
        this.subscription = result = this._customerService.getAdminUser(adminCred);
        result.subscribe(function (x) {
            _this.adminUser = x;
            if (_this.adminUser != 0) {
                _this.serviceLoading = false;
                if (_this.adminUser[0].Username == username && _this.adminUser[0].Password == password) {
                    _this.AdminPortal();
                    _this.adminUsername = _this.adminUser[0].Username;
                    _this.adminPassword = _this.adminUser[0].Password;
                    localStorage.setItem(_this.tokenKey, JSON.stringify(_this.adminUsername + _this.adminPassword));
                    //localStorage.setItem(this.tokenKey, JSON.stringify("SignedIn"));
                    username = '';
                    password = '';
                    _this.adminUser = {};
                }
            }
            else {
                _this.serviceLoading = false;
                _this.wrongCred = true;
            }
        });
    };
    AdminLoginComponent.prototype.log = function (x) {
        console.log(x);
    };
    AdminLoginComponent.prototype.onSubmit = function () {
        console.log('form submit clicked..');
    };
    AdminLoginComponent.prototype.AdminPortal = function () {
        this.router.navigate(['./AdminPortal']);
    };
    AdminLoginComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'AdminLogin',
            templateUrl: 'AdminLogin.component.html',
            styles: ["\n.loginmodal-container {\n    padding: 30px;\n    max-width: 350px;\n    width: 100% !important;\n    background-color: #F7F7F7;\n    margin: 0 auto;\n    border-radius: 2px;\n    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);\n    overflow: hidden;\n    font-family: roboto;\n}\n\n.loginmodal-container h1 {\n  text-align: center;\n  font-size: 1.8em;\n  font-family: roboto;\n}\n\n.loginmodal-container input[type=submit] {\n  width: 100%;\n  display: block;\n  position: relative;\n}\n\n.loginmodal-container input[type=text], input[type=password] {\n  height: 44px;\n  font-size: 16px;\n  width: 100%;\n  -webkit-appearance: none;\n  background: #fff;\n  border: 1px solid #d9d9d9;\n  border-top: 1px solid #c0c0c0;\n  /* border-radius: 2px; */\n  padding: 0 8px;\n  box-sizing: border-box;\n  -moz-box-sizing: border-box;\n}\n\n.loginmodal-container input[type=text]:hover, input[type=password]:hover {\n  border: 1px solid #b9b9b9;\n  border-top: 1px solid #a0a0a0;\n  -moz-box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);\n  -webkit-box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);\n  box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);\n}\n\n.loginmodal {\n  text-align: center;\n  font-size: 14px;\n  font-family: 'Arial', sans-serif;\n  font-weight: 700;\n  height: 36px;\n  padding: 0 8px;\n/* border-radius: 3px; */\n/* -webkit-user-select: none;\n  user-select: none; */\n}\n\n.loginmodal-submit {\n  /* border: 1px solid #3079ed; */\n  border: 0px;\n  color: #fff;\n  text-shadow: 0 1px rgba(0,0,0,0.1); \n  background-color: #4d90fe;\n  padding: 17px 0px;\n  font-family: roboto;\n  font-size: 14px;\n  /* background-image: -webkit-gradient(linear, 0 0, 0 100%,   from(#4d90fe), to(#4787ed)); */\n}\n\n.loginmodal-submit:hover {\n  /* border: 1px solid #2f5bb7; */\n  border: 0px;\n  text-shadow: 0 1px rgba(0,0,0,0.3);\n  background-color: #357ae8;\n  /* background-image: -webkit-gradient(linear, 0 0, 0 100%,   from(#4d90fe), to(#357ae8)); */\n}\n\n.loginmodal-container a {\n  text-decoration: none;\n  color: #666;\n  font-weight: 400;\n  text-align: center;\n  display: inline-block;\n  opacity: 0.6;\n  transition: opacity ease 0.5s;\n} \n\n.login-help{\n  font-size: 12px;\n}\n  "]
        }), 
        __metadata('design:paramtypes', [router_1.Router, customer_service_1.CustomerService, common_1.PlatformLocation])
    ], AdminLoginComponent);
    return AdminLoginComponent;
}());
exports.AdminLoginComponent = AdminLoginComponent;
//# sourceMappingURL=AdminLogin.component.js.map