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
var platform_browser_1 = require('@angular/platform-browser');
var http_1 = require('@angular/http');
var forms_1 = require('@angular/forms');
var core_module_1 = require('angular2-google-maps/core/core-module'); //'@agm/core';  --- GOOGLE MAPS
var angular2_text_mask_1 = require('angular2-text-mask');
//import {MomentModule} from 'angular2-moment';
//import {NgxPaginationModule} from 'ngx-pagination'; // pagination
var app_component_1 = require('./app.component');
var todos_component_1 = require('./components/todos.component');
var RequestRide_component_1 = require('./components/RequestRide.component');
var RequestSubmitted_component_1 = require('./components/RequestSubmitted.component');
var ConfirmInfo_component_1 = require('./components/ConfirmInfo.component');
var AdminPortal_component_1 = require('./components/AdminPortal.component');
var AdminLogin_component_1 = require('./components/AdminLogin.component');
var ModifyRequests_component_1 = require('./components/ModifyRequests.component');
var app_routing_1 = require('./app.routing');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule,
                http_1.HttpModule,
                angular2_text_mask_1.TextMaskModule,
                forms_1.FormsModule,
                app_routing_1.routing,
                core_module_1.AgmCoreModule.forRoot({
                    apiKey: 'AIzaSyD3HOzxe15DyICCdTGLGHhkenAvi23lUuQ',
                    libraries: ["places"]
                })
            ],
            declarations: [app_component_1.AppComponent, todos_component_1.TodosComponent, RequestRide_component_1.RequestRideComponent, RequestSubmitted_component_1.RequestSubmittedComponent, ConfirmInfo_component_1.ConfirmInfoComponent, AdminPortal_component_1.AdminPortalComponent, AdminLogin_component_1.AdminLoginComponent, ModifyRequests_component_1.ModifyRequestsComponent],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map