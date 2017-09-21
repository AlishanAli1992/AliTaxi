import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router }   from '@angular/router';
import {MapsAPILoader} from 'angular2-google-maps/core'; // GOOGLE MAPS
import {} from '@types/googlemaps'; // GOOGLE MAPS

import {CustomerService} from '../services/customer.service';
import {Customer} from '../Customer';
import {CustEmail} from '../CustEmail';
import {Name} from '../Name';
import {Bool} from '../Bool';
import {CustomerReviews} from '../CustomerReviews';
import {DropdownValue} from '../DropdownValue';
import {ConfirmInfoComponent} from './ConfirmInfo.component';

@Component({
  moduleId: module.id,
  selector: 'ModifyRequests',
  templateUrl: 'ModifyRequests.component.html',
  styleUrls: ['ModifyRequests.component.css']
 
})
export class ModifyRequestsComponent implements OnInit  { 

    NgPhoneNum: string;
    Ngemail: string;

    DeclineSuccess: any;
    DeclinedRequest: boolean;
    NoDeclinedRequest: boolean;
    




    constructor(private router: Router, private _customerService: CustomerService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {

      this.NgPhoneNum = "";
      this.Ngemail = "";

      this.DeclinedRequest = false;
      this.NoDeclinedRequest = false;
      this.DeclineSuccess = []

    }

    ngOnInit(){     



    }


    CancelRideRequest() {

        console.log(this.DeclineSuccess)

    this.DeclinedRequest = false;
    this.NoDeclinedRequest = false;

        var emailObj = {
            email: this.Ngemail
        }

        var EmailObject = {
              cusEmail: this.Ngemail, // To Customer
              subject: "Update: Your Ride is Cancelled - Ali-Taxi" ,
              content: `
              This is an automatic message. 
              You recently Cancelled your ride request.  

                Thank you,
                From Ali-Taxi Team.`
            }

            var result = this._customerService.UpdateRequestToDeclined(emailObj);
          result.subscribe(declinestatus => {
            this.DeclineSuccess = declinestatus;

                if(this.DeclineSuccess >= 1){
                    this.DeclinedRequest = true;
                    console.log(this.DeclineSuccess)
                }
                else if (this.DeclineSuccess == 0){
                    this.NoDeclinedRequest = true;
                }
            this.sendEmail(EmailObject);
        });

    }


    sendEmail(EmailObject){
  this._customerService.sendemail(EmailObject)
                .subscribe(result => {
                console.log(result);
            });
    }




   log(x: any) 
    {
     console.log(x);
     console.log(this.searchElement);
    }


    GoBackHomePage()
    {
      this.router.navigate(['.']);
    }
}

