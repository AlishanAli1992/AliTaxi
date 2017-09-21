import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule } from 'angular2-google-maps/core/core-module'; //'@agm/core';  --- GOOGLE MAPS
import { TextMaskModule } from 'angular2-text-mask';
//import {MomentModule} from 'angular2-moment';
//import {NgxPaginationModule} from 'ngx-pagination'; // pagination

import {AppComponent} from './app.component';
import {TodosComponent} from './components/todos.component';
import { RequestRideComponent } from './components/RequestRide.component';
import { RequestSubmittedComponent } from './components/RequestSubmitted.component';
import { ConfirmInfoComponent} from './components/ConfirmInfo.component';
import {AdminPortalComponent} from './components/AdminPortal.component';
import {AdminLoginComponent} from './components/AdminLogin.component';
import {ModifyRequestsComponent} from './components/ModifyRequests.component'
import {routing} from './app.routing';

@NgModule({
  imports:      [ BrowserModule, 
    HttpModule, 
    TextMaskModule,
    FormsModule, 
    routing, 
    AgmCoreModule.forRoot({              // GOOGLE MAPS
      apiKey: 'AIzaSyD3HOzxe15DyICCdTGLGHhkenAvi23lUuQ',
      libraries: ["places"]
    })
  
  ],
  declarations: [AppComponent, TodosComponent, RequestRideComponent, RequestSubmittedComponent, ConfirmInfoComponent, AdminPortalComponent, AdminLoginComponent, ModifyRequestsComponent],
  bootstrap: [AppComponent]
})

export class AppModule { }
