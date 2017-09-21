import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router }   from '@angular/router';
//import * as moment from 'moment/moment';
import * as moment from 'moment-timezone';

import {CustomerService} from '../services/customer.service';
import {Customer} from '../Customer';


@Component({
  moduleId: module.id,
  selector: 'AdminPortal',
  templateUrl: 'NewAdminPortal.component.html',
  styleUrls: ['AdminPortal.component.css']
//   styles: [`

// .custab{
//     border: 1px solid #ccc;
//     padding: 5px;
//     margin: 5% 0;
//     box-shadow: 3px 3px 2px #ccc;
//     transition: 0.5s;
//     }

// .custab:hover{
//     box-shadow: 3px 3px 0px transparent;
//     transition: 0.5s;
//     }

// table {
//     background-color: white;
//     border-collapse: collapse;
//     border-spacing: 0;
// }

// tbody {
//     display: table-row-group;
//     vertical-align: middle;
//     border-color: inherit;
// }

//   `]
})
export class AdminPortalComponent implements OnInit  { 

    yesterdayDate: string;

    pastRequestUpdated: any;

    DeclineReq: boolean;
    emailOfDeclineRequest: string;
    indexOfDeclineRequest: number;

    RidePaymentDetails: any;
    UpdateFees: boolean;

    newPricingSaved: boolean;

    ngFeePerMile:number;
    ngFeePerPassenger: number;
    ngBaseFee: number;

    NgDriverComment: string;


    Info_FirstName: string;
    Info_LastName: string;
    Info_Email: string;
    Info_Phone: string;
    showCustInfo: boolean;

    p: number = 1; // pagination

    initialized = false;
    customer: Customer[];
    Accept: string;
    RideAccepted: boolean;

    inputName : string = '';
    filteredItems : Customer[];

    pageStart:number = 0;
    pageEnd:number = 100;
    pageHeight:number = 30;
    pageBuffer:number = 100;

    deleting: boolean;

    public fullPath: string;


    constructor(private router: Router, private _customerService: CustomerService, private changeDetectorRef: ChangeDetectorRef) {
    
      this.initialized = false;
     
      this.Accept = "Accept Request"
      this.RideAccepted = true;

      this.deleting = false;

      this.customer = []; 

      this.fullPath = 'app/assets/Preloader_8.gif';  // since you are running npm run tsc --w from "cd documents/projects/meantodos/client" then after client it's "app" then "assets"

      this.showCustInfo = false;

      this.UpdateFees = false;

      this.newPricingSaved = false;

      this.DeclineReq = false;

      this.NgDriverComment = '';
      
      this.emailOfDeclineRequest = '';

      this.indexOfDeclineRequest = null;

      this.yesterdayDate = '';
    }


    ngOnInit(){

      this.GetYesterdayDate();

      this.RunPastRequestUpdate();

      this._customerService.getRidePaymentDetails()
                .subscribe(paymentinfo => {
                this.RidePaymentDetails = paymentinfo;

                  this.ngFeePerMile = this.RidePaymentDetails[0].FeePerMile;
                  this.ngFeePerPassenger = this.RidePaymentDetails[0].FeePerPassenger;
                  this.ngBaseFee = this.RidePaymentDetails[0].BaseFee;

                  this.initialized = false;

                });
            
       //this.getMyPicture();

            //     setTimeout(() => {
            // this.initialized = true;
            // }, 3000)
            

            this._customerService.getAllCustomers()
                .subscribe(customer => {
                this.customer = customer;
                console.log(this.customer);

                this.initialized = true;
            });
            

    }


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

    onScroll( event, doc )
  {
    const scrollTop = event.target.scrollTop;
    const scrollHeight = event.target.scrollHeight;
    const offsetHeight = event.target.offsetHeight;
    const scrollPosition = scrollTop + offsetHeight;
    const scrollTreshold = scrollHeight - this.pageHeight;
    if( scrollPosition > scrollTreshold ){
      this.pageEnd+= this.pageBuffer;
    }
  }


  GetYesterdayDate() {

          var newDate = new Date(Date.now() - (86400000*2));
        this.yesterdayDate = newDate.toISOString().slice(0,10);
          console.log(this.yesterdayDate);

  }

  RunPastRequestUpdate(){

          var momentToday = moment().tz("America/Chicago").format('YYYY-MM-DD'); // Texas has the same time zone as Chicago
          console.log(momentToday + " - Today using moment");

          var TodayDate = {
              date: momentToday
          }

          this._customerService.UpdateToPastRequest(TodayDate)
                .subscribe(recordsupdated => {
                this.pastRequestUpdated = recordsupdated;
               console.log("number of records updated to past requests:")
               console.log(recordsupdated)

               this.initialized = false;

                });


  }


  OpenRideFees() {
    this.UpdateFees = true;
    console.log(this.UpdateFees)
  }

  OpenCustomerRequests() {
    this.UpdateFees = false;
    console.log(this.UpdateFees)
  }

  UpdateRideFees(feeMile, feePassenger, baseFee){


  if(this.ngFeePerMile.toString() != '' && this.ngFeePerPassenger.toString() != '' && this.ngBaseFee.toString() != '')
    {

   var Pricing = {
      FeePerMile: this.ngFeePerMile, 
      FeePerPassenger: this.ngFeePerPassenger, 
      BaseFee: this.ngBaseFee
    };

    console.log(Pricing);

    
      this._customerService.UpdateRidePricing(Pricing)
                .subscribe(paymentinfo => {
                  this.newPricingSaved = true;

                });
    }
  }

    onAccept(index, CustID) {

      this.deleting = true;
      var result;
       var NewBool = {
          obj: true,
          email: this.customer[index].EmailAddr
      };

      var EmailObject = {
              cusEmail: this.customer[index].EmailAddr, // To Customer
              subject: "Congrats, Your Ride Request was Accepted! - Ali-Taxi" ,
              content: `
              This is an automatic message. 
              Congrats, Your Ride Request was Accepted!
              Your driver will pick you up on: `
              +this.customer[index].PickUpDate.replace('T00:00:00.000Z', '')+
              `
              At: ` +this.customer[index].PickUpTime+

              `
              From Your Location: ` +this.customer[index].CustAddress+

                `

              Thank you,
              From Ali-Taxi Team.`
            }

      console.log("NewBool");
      console.log(NewBool);

        result = this._customerService.UpdateRequestAccepted(NewBool);
          result.subscribe(x => {
            this.deleting = false;

            this.sendEmail(EmailObject);
        });

       setTimeout(() => {
            this.initialized = true;
            }, 2000)

    }


  DeclineCusReq(index){

    this.DeclineReq = true;
    this.emailOfDeclineRequest = this.customer[index].EmailAddr;
    this.indexOfDeclineRequest = index;

}

DeclineReqReason() {
    
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
              cusEmail: this.emailOfDeclineRequest, // To Customer
              subject: "Driver Declined your Ride Request! - Ali-Taxi" ,
              content: `
              This is an automatic message. 
              We are very sorry.. The driver has declined your ride request for this reason: `
              +this.NgDriverComment+

                `
              Please submit another request at anytime. Again we apologize.

              Thank you,
              From Ali-Taxi Team.`
            }


 result = this._customerService.DeclineCusReq(DeclineCustReqObj);
          result.subscribe(x => {

            this.deleting = false;
            this.customer.splice(this.indexOfDeclineRequest, 1);
            this.DeclineReq = false;

            this.sendEmail(EmailObject);
        });


       setTimeout(() => {
            this.initialized = true;
            }, 2000)


}


sendEmail(EmailObject){
  this._customerService.sendemail(EmailObject)
                .subscribe(result => {
                console.log(result);
            });
}



  deleteItem(index, CustID) {

      this.deleting = true;
      var result;
       var DeleteObj = {
          custID: CustID
      };
        console.log(DeleteObj.custID + " delete object cust id");

        result = this._customerService.DeleteCustomer(DeleteObj);
          result.subscribe(x => {
            this.deleting = false;
        });
      console.log(index);
      this.customer.splice(index, 1);

       setTimeout(() => {
            this.initialized = true;
            }, 2000)
    }

    
  ShowCustInfo(index){
    this.Info_FirstName = this.customer[index].FirstName;
    this.Info_LastName = this.customer[index].LastName;
    this.Info_Email = this.customer[index].EmailAddr;
    this.Info_Phone = this.customer[index].PhoneNum.toString();
    this.showCustInfo = true;
  }

  CloseCustInfo(){
    this.showCustInfo = false;
    this.Info_FirstName = "";
    this.Info_LastName = "";
    this.Info_Email = "";
    this.Info_Phone = null;
  }
  



   log(x: any) 
    {
     console.log(x);
    }

    onComplete()
    {
      //this.router.navigate(['./RequestSubmitted']);
      //this.router.navigate(['./ConfirmInfo'], { queryParams: { page: this.sum } });
    }

    onSubmit(){
        console.log('form submit clicked..');
    }

    LogoutAdmin()
    {
      localStorage.removeItem('app_token');
      this.router.navigate(['./AdminLogin']);
    }
    
}
