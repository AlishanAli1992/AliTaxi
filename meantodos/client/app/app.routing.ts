import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes }   from '@angular/router';
import { RequestSubmittedComponent } from './components/RequestSubmitted.component';
import { RequestRideComponent } from './components/RequestRide.component';
import { ConfirmInfoComponent } from './components/ConfirmInfo.component';
import {AdminPortalComponent} from './components/AdminPortal.component';
import {AdminLoginComponent} from './components/AdminLogin.component';
import {ModifyRequestsComponent} from './components/ModifyRequests.component';

const appRoutes: Routes = [
    {
        path: '',
        component: RequestRideComponent
    },
    {
        path: 'RequestSubmitted',
        component: RequestSubmittedComponent
    },
    {
        path: 'ConfirmInfo',
        component: ConfirmInfoComponent
    },
    {
        path: 'AdminPortal',
        component: AdminPortalComponent
    },
    {
        path: 'AdminLogin',
        component: AdminLoginComponent
    },
    {
        path: 'ModifyRequests',
        component: ModifyRequestsComponent
    }


];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);