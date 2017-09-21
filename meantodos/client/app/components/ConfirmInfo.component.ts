import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute }   from '@angular/router';
import {Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';


import {CustomerService} from '../services/customer.service';
import {Customer} from '../Customer';
import {UpdateCus} from '../UpdateCus';
//import {RequestRideComponent} from './RequestRide.component';


@Component({
  moduleId: module.id,
  selector: 'ConfirmInfo',
  templateUrl: 'NewConfirmInfo.component.html',
  styleUrls: ['ConfirmInfo.component.css']
//   styles: [`
// input {
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
//   `]
})
export class ConfirmInfoComponent implements OnInit  { 

    private fromLocTokenKey:string = 'app_token_confirmInfo_from';
    private toLocTokenKey:string = 'app_token_confirmInfo_to';
    private passengersTokenKey:string = 'app_token_confirmInfo_passengers';
    private emailaddTokenKey:string = 'app_token_confirmInfo_emailadd';

    TollFromLoc: string;
    TollToLoc: string;

    emailAddStored: string;

    FromPlace: string;
    ToPlace: string;
    numOfPassengers: string;
    totalPayment: number;

    RidePaymentDetails: any;

    subtractCounter: number;
    orginalFee: number;
    subErrorMsg: boolean;

    confirmPmtLoading:boolean;

    custDecAmt:boolean;

    googleDistanceInfo: object[];
    googleDistanceMilesInfo: object[]; 
    googleFrom: string;
    googleTo: string;
    completeGoogleApiAddress: string;

    public fullPath: string;

    errorMsg: boolean;
    customer: Customer[];
    allCustInfo: string[];
    allCustFields: string[];
    sub: any;
    page: any;
    mode: boolean;
    updated: boolean;
    editing: boolean;
    firstNameChanged: boolean;
    updateValue: any[];
    updateCus: UpdateCus[];
    NgFirstName: string;
    FirstNameUI: string;
    initialized = false;

    FirstNameChangeValue: string;
    LastNameChangeValue: string;
    CustAddressChangeValue: string;
    DropOffLocChangeValue: string;
    EmailAddrChangeValue: string;
    PhoneNumChangeValue: string;

    NgCusComment: string;


    constructor(private router: Router, private _customerService: CustomerService, private route: ActivatedRoute, private _http:Http) {
      
      this.fullPath = 'app/assets/Preloader_8.gif'; 

      this.errorMsg = false;
      this.updated = false;
      this.mode = true;
      this.editing = false;
      this.NgFirstName = '';
      this.firstNameChanged = false;
      this.FirstNameUI = '';

      this.FromPlace = '';
      this.ToPlace = '';
      this.completeGoogleApiAddress = '';

      this.totalPayment = null;

      this.confirmPmtLoading = true;

      this.subtractCounter = null;
      this.orginalFee = 0;
      this.subErrorMsg = false;

      this.custDecAmt = false;

      this.NgCusComment = '';

      this.TollFromLoc = '';
      this.TollToLoc = '';
    }


      ngOnInit(){


        this._customerService.getRidePaymentDetails()
                .subscribe(paymentinfo => {
                this.RidePaymentDetails = paymentinfo;

                });


        let fromStoredToken:string = localStorage.getItem(this.fromLocTokenKey);
        let toStoredToken:string = localStorage.getItem(this.toLocTokenKey);
        let passengersStoredToken:string = localStorage.getItem(this.passengersTokenKey);
        
        // to calculate toll
        this.TollFromLoc = fromStoredToken;
        this.TollToLoc = toStoredToken;

        if(!fromStoredToken||!toStoredToken||!passengersStoredToken)  // if anything "throw" error, then API call methods will be disabled since application has "error"
          {
            console.log("no token found")
          }
        else{
          console.log("From: "+fromStoredToken+" To: "+toStoredToken+ "passengers: "+passengersStoredToken)
          //if(storedToken.indexOf("SignedIn"))
          if(fromStoredToken&&toStoredToken&&passengersStoredToken)
            {
              console.log(fromStoredToken.toString())
              console.log(toStoredToken.toString())

              this.FromPlace = fromStoredToken.replace(/["']/g,'');
              this.ToPlace = toStoredToken.replace(/["']/g,'');
              this.numOfPassengers = passengersStoredToken.replace(/["']/g,'');

              this.updateAddressForApi()
            }
        }
        

        this.googleDistanceInfo = [];

        this._customerService.getGoogleDist(this.completeGoogleApiAddress)
                .subscribe(distanceInfo => {
               //this.googleDistanceInfo = JSON.stringify(distanceInfo);
                this.googleDistanceInfo = distanceInfo.body;


                console.log("Google Distance Info:");
                   console.log(this.googleDistanceInfo);

                   this.googleDistanceInfo = JSON.parse(distanceInfo.body);
                   console.log(this.googleDistanceInfo);

                let miles = JSON.parse(distanceInfo.body); // In variable type "any", you can get "any" property with "any" name as long as that variable actually has that property in run time
                this.googleDistanceMilesInfo = miles.rows[0].elements[0].distance.text.replace('miles', '').replace(/ /g, '') // In variable "object", you can only get properties that you actually "definied" which are "static - hardcoded"
               
                this.CalculatePayment();

                });
                   





         setTimeout(() => {
      this.initialized = true;
    }, 7500)


        this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.page = +params['page'] || 0;
      });

      console.log(this.page + " this is the Customer ID from the router");
        
      // calls the service to retrieve the customer data
        this.customer = [];

                this._customerService.getSavedCustomer(this.page)
                .subscribe(customer => {
                this.customer = customer;

                });
              console.log(JSON.stringify(this.customer));

              console.log("Loggin the Problem!")
              console.log(this.googleDistanceInfo)
              console.log(this.numOfPassengers)
              console.log(this.totalPayment)
              console.log(this.RidePaymentDetails)

              }


    updateAddressForApi(){

      var from = this.FromPlace.toString().replace('United States','').replace(/ $/, "").replace(/[,]/g,'')
      var to = this.ToPlace.toString().replace('United States','').replace(/ $/, "").replace(/[,]/g,'')

      this.googleFrom = from.replace(/ /g, "+")
      this.googleTo = to.replace(/ /g, "+")

      console.log(this.googleFrom + " - google from")
      console.log(this.googleTo + " - google to")
      console.log(this.googleFrom+"&destinations="+this.googleTo)

      this.completeGoogleApiAddress = this.googleFrom+"&destinations="+this.googleTo;
    }
        
    CalculatePayment(){

      console.log(this.RidePaymentDetails[0].FeePerMile + " -fee per mile");
      console.log( this.RidePaymentDetails[0].FeePerPassenger + " -fee per passenger");
      console.log(this.RidePaymentDetails[0].BaseFee + " -Base fee");
      console.log(this.RidePaymentDetails)
     
      var feePerMile = this.RidePaymentDetails[0].FeePerMile 
      var feePerPassenger = this.RidePaymentDetails[0].FeePerPassenger
      var baseFee = this.RidePaymentDetails[0].BaseFee
      var tollFee = 5;

      var peopleCal = this.numOfPassengers
      var milesCal = this.googleDistanceMilesInfo.toString().replace('mi', '').replace(/ /g, '') 
      console.log("milesCal = " +milesCal)

      var peopleCalNum = parseInt(peopleCal);
      
      this.numOfPassengers = (peopleCalNum - 1).toString();

      var milesCalNum = parseFloat(milesCal);
      console.log("milesCalNum (double number) = " +milesCalNum)
      var milesCalNumRounded = Math.round(milesCalNum);
      console.log("milesCalNum (double number/Rounded) = " +milesCalNumRounded)

      console.log("Calulate = " +peopleCal+ " = passengers \ miles = " +milesCal)
      console.log(milesCalNumRounded + " miles rounded")

      var calulatedPayment = milesCalNumRounded*feePerMile+((peopleCalNum*feePerPassenger)-feePerPassenger);

console.log(this.TollFromLoc + " from loc for toll") 
console.log(this.TollToLoc + " to loc for toll") 


    if(!this.TollFromLoc.includes('DFW Airport') 
      && !this.TollFromLoc.includes('Dallas Love Field Airport')
      && !this.TollToLoc.includes('DFW Airport')
      && !this.TollToLoc.includes('Dallas Love Field Airport') ){


          if(calulatedPayment > 6)
            {
              console.log(calulatedPayment + " calculated payment is greater then 6")
              this.totalPayment = calulatedPayment + baseFee;
            }
          if(calulatedPayment < 6)
            {
              this.totalPayment = 0;
              console.log(calulatedPayment + " calculated payment is LESS then 6")
              this.totalPayment = baseFee + calulatedPayment; //+ ((peopleCalNum*5)-5);
            }
          if(milesCalNumRounded >= 20)
            {
              this.totalPayment = 0;
              console.log(calulatedPayment + " distance in miles is greater then or equal to 20 so toll will be added")
              this.totalPayment = baseFee + calulatedPayment + tollFee; 
            }
          if(milesCal.indexOf('ft') > -1)
          {
            this.totalPayment = 0;
            console.log(milesCal + " milesCal is actually feet so minimum pay is $6")
              this.totalPayment = baseFee + ((peopleCalNum*feePerPassenger)-feePerPassenger);
          }
    }     
      else
        {
          this.totalPayment = 0;
          console.log(calulatedPayment + " Location from or to has Aiport so toll will be added")
          this.totalPayment = baseFee + calulatedPayment + tollFee; 
        }




      console.log("Total Payment = " +this.totalPayment)

      this.confirmPmtLoading == false

    }

    SubtractFee(){

      if(this.subtractCounter == null)
        {
          this.orginalFee = this.totalPayment
            console.log(this.orginalFee)
        }

      //if(this.totalPayment > this.orginalFee - 10)
      if(this.totalPayment > this.orginalFee - (this.orginalFee*0.10))
        {
          this.totalPayment = this.totalPayment - 1;
            console.log(this.orginalFee)
          this.subtractCounter ++;
        }

      
      //if(this.totalPayment >= this.orginalFee - 10 || this.totalPayment >= this.orginalFee - 1)
      if(this.totalPayment < this.orginalFee - (this.orginalFee*0.01))
        {
          this.subErrorMsg = true;
        }
      //else 
      else if (this.totalPayment >= this.orginalFee)
        {
          this.subErrorMsg = false;
        }


      // if(this.subtractCounter == null)
      //   {
      //     this.orginalFee = this.totalPayment
      //     console.log(this.orginalFee)
      //   }

      // if(this.totalPayment > this.orginalFee - 10)
      //   {
      //     this.subtractCounter = this.totalPayment - (this.orginalFee - 10)
      //   }

      // if (this.subtractCounter != 11 && !(this.totalPayment < this.orginalFee - 10))
      //   {
      //      this.totalPayment = this.totalPayment - 1;
      //      console.log(this.orginalFee)
      //      this.subtractCounter ++;
      //   }

    }

   AddFee(){

        if(this.subtractCounter == null)
        {
          this.orginalFee = this.totalPayment
            console.log(this.orginalFee)
        }
        this.subtractCounter ++;

        this.totalPayment = this.totalPayment + 1;
        console.log(this.orginalFee)


       //if(this.totalPayment >= this.orginalFee - 10 || this.totalPayment >= this.orginalFee - 1)
      if(this.totalPayment < this.orginalFee - (this.orginalFee*0.01))
        {
          this.subErrorMsg = true;
        }
      //else 
      else if (this.totalPayment >= this.orginalFee)
        {
          this.subErrorMsg = false;
        }
      
    }



    ConfirmAmount()
    {
      let emailAddStoredToken:string = localStorage.getItem(this.emailaddTokenKey);
        if(emailAddStoredToken)
          {
            this.emailAddStored = emailAddStoredToken.replace(/["']/g,'').replace(/ $/, "");

             if(this.orginalFee != 0) {
         
                var emailObj = {
                  email: this.emailAddStored,
                  acceptedAmt: this.totalPayment,
                  OrignalAmt: this.orginalFee
                };
             }

            if(this.orginalFee == 0) {
         
                var emailObj = {
                  email: this.emailAddStored,
                  acceptedAmt: this.totalPayment,
                  OrignalAmt: this.totalPayment
                };
            }

            var EmailObject = {
              cusEmail:"alishanuta2014@gmail.com", // To Admin
              subject: "New Ride Request! - Ali-Taxi" ,
              content: `
              This is an automatic message. 
              You have a new Customer Ride Request. 
              Please Accept or Decline this request in your Admin Portal.  

                Thank you,
                From Ali-Taxi Team.`
            }



                console.log(emailObj.OrignalAmt+ " OrignalAmt")
                console.log(emailObj.acceptedAmt+ " acceptedAmt")
          }
      this._customerService.CusAcceptedAmt(emailObj)
                .subscribe(result => {
                console.log(result);
                this.router.navigate(['./RequestSubmitted']);

                this.sendEmail(EmailObject);

            });
    }


sendEmail(EmailObject){
  this._customerService.sendemail(EmailObject)
                .subscribe(result => {
                console.log(result);
            });
}




  ReturnTolanding(){
    if(this.NgCusComment != ''){

  

    let emailAddStoredToken:string = localStorage.getItem(this.emailaddTokenKey);
        if(emailAddStoredToken)
          {
            this.emailAddStored = emailAddStoredToken.replace(/["']/g,'').replace(/ $/, "");

         if(this.orginalFee != 0) {
         
                var emailObj = {
                  email: this.emailAddStored,
                  CusComment: this.NgCusComment,
                  OrignalAmt: this.orginalFee
                };
         }

        if(this.orginalFee == 0) {
         
                var emailObj = {
                  email: this.emailAddStored,
                  CusComment: this.NgCusComment,
                  OrignalAmt: this.totalPayment
                };
         }
                console.log(emailObj.CusComment+ " CusComment")
          }


            var EmailObject = {
              cusEmail:"alishanuta2014@gmail.com", // To Admin
              subject: "New Customer Decline - Ali-Taxi" ,
              content: `
              This is an automatic message. 
              Recently a Customer filled the ride request form but declined the ride.
              This is their comment: `
              +this.NgCusComment+ ` 
              This is their fee: $` +this.totalPayment+
               ` 
               
              Thank you,
              From Ali-Taxi Team.`
            }


      this._customerService.CusDeclinedAmt(emailObj)
                .subscribe(result => {
                console.log(result);
                this.router.navigate(['.']);
                this.sendEmail(EmailObject)
            });
    }

  }

  CustDeclinedAmt(){
    this.custDecAmt = true;
  }

   log(x: any) 
    {
     console.log(x);
    }

    onComplete()
    {
      this.router.navigate(['./RequestSubmitted']);
    }

    onSubmit(){
        console.log('form submit clicked..');
    }

    updateStatus(bool: boolean, editMode: boolean = false){
      this.mode = bool;
      console.log(this.mode);

      this.editing = editMode;
    }

    InputValueChange(bool: boolean)
    {
      this.firstNameChanged = bool;
    }

    updateCustomer(value: string, field: string)
    {
      switch (field) {

            case 'FirstName':
              this.FirstNameChangeValue = value;
              break; 
            case 'LastName':
              this.LastNameChangeValue = value;
              break; 
            case 'CustAddress':
              this.CustAddressChangeValue = value;
              break; 
            case 'DropOffLoc':
              this.DropOffLocChangeValue = value;
              break; 
            case 'EmailAddr':
              this.EmailAddrChangeValue = value;
              break; 
            case 'PhoneNum':
              this.PhoneNumChangeValue = value;
              break; 
    }

       var result;
       var newCust = {
        CustField: value,
        FieldName: field
      };

  // var changeValue;
  //     switch (field) {

  //           case 'FirstName':
  //            changeValue = this.FirstNameChangeValue;
  //             break; 
  //           case 'LastName':
  //            changeValue = this.LastNameChangeValue;
  //             break; 
  //           case 'CustAddress':
  //            changeValue = this.CustAddressChangeValue;
  //             break; 
  //           case 'DropOffLoc':
  //            changeValue = this.DropOffLocChangeValue;
  //             break; 
  //           case 'EmailAddr':
  //            changeValue = this.EmailAddrChangeValue;
  //             break; 
  //           case 'PhoneNum':
  //            changeValue = this.PhoneNumChangeValue;
  //             break; 
  //   }




          result = this._customerService.UpdateOneCusField(newCust, this.page);
          result.subscribe(x => {
        //this.updateValue.push(value);
            //this.updateValue.push(newCust);
        });

this.FirstNameUI = value;
    console.log(value);
    console.log(result + " - THIS IS THE RESULT");

      this.updateStatus(true)
      if(value != '')
      {
        this.updated = true;
      }

    }




}
