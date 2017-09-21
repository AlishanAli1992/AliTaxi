"use strict";
var router_1 = require('@angular/router');
var RequestSubmitted_component_1 = require('./components/RequestSubmitted.component');
var RequestRide_component_1 = require('./components/RequestRide.component');
var ConfirmInfo_component_1 = require('./components/ConfirmInfo.component');
var AdminPortal_component_1 = require('./components/AdminPortal.component');
var AdminLogin_component_1 = require('./components/AdminLogin.component');
var ModifyRequests_component_1 = require('./components/ModifyRequests.component');
var appRoutes = [
    {
        path: '',
        component: RequestRide_component_1.RequestRideComponent
    },
    {
        path: 'RequestSubmitted',
        component: RequestSubmitted_component_1.RequestSubmittedComponent
    },
    {
        path: 'ConfirmInfo',
        component: ConfirmInfo_component_1.ConfirmInfoComponent
    },
    {
        path: 'AdminPortal',
        component: AdminPortal_component_1.AdminPortalComponent
    },
    {
        path: 'AdminLogin',
        component: AdminLogin_component_1.AdminLoginComponent
    },
    {
        path: 'ModifyRequests',
        component: ModifyRequests_component_1.ModifyRequestsComponent
    }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map