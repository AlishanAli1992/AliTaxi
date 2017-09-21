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
  selector: 'RequestRide',
  templateUrl: 'NewRequestRide2.component.html',
  styleUrls: ['RequestRide.component.css']
 
})
export class RequestRideComponent implements OnInit  { 

    public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/] // for phone number

    // store customer data in cookies
    private fromLocTokenKey:string = 'app_token_confirmInfo_from';
    private toLocTokenKey:string = 'app_token_confirmInfo_to';
    private passengersTokenKey:string = 'app_token_confirmInfo_passengers';
    private firstnameTokenKey:string = 'app_token_confirmInfo_firstname';
    private lastnameTokenKey:string = 'app_token_confirmInfo_lastname';
    private emailaddTokenKey:string = 'app_token_confirmInfo_emailadd';
    private pickedDateTokenKey:string = 'app_token_confirmInfo_pickedDate';
    private pickUpTimeTokenKey:string = 'app_token_confirmInfo_pickUpTime';
    private phoneNumTokenKey:string = 'app_token_confirmInfo_phoneNum';

    private tokenKey:string = 'app_token';
    enableDeleteComments:boolean;
    nonCustomer:boolean;
    FullCusName:string;

    firstNameStored: string;
    lastNameStored: string;
    fromLocStored: string;
    toLocStored: string;
    passengersStored: string;
    emailAddStored: string;
    pickedDateStored: string;
    pickUpTimeStored: string;
    phoneNumStored:string;

    clearSearch:boolean;

    pauseChecking:boolean;

    PickUpChange:boolean = false;
    dropOffChange:boolean = false;

    @ViewChild('search') public searchElement: ElementRef; // GOOGLE MAPS
    @ViewChild('searchnew') public searchElement2: ElementRef; // GOOGLE MAPS

    pageStart:number = 0;
    pageEnd:number = 100;
    pageHeight:number = 30;
    pageBuffer:number = 100;

    appName: string;
    errorMsg: boolean;
    userEmail: string;
    userReEmail: string;
    customer: Customer[];
    //allCustomerReviews: CustomerReviews[];
    //customerReviews: any[];
    allCustomerReviews: any[];
    custEmail: CustEmail[];
    custEmailNonExi: boolean;
    Datname: Name[];  
    //custExist: number;
    custExist: any;
    sum: number = Math.floor(Math.random() * 1000) + 1;  //Where: 1 is the start number and 6 is the number of possible results (1 + start (6) - end (1))
    NgfirstName: string;
    NgLastName: string;
    NgPickUpLoc: string;
    NgDropOffLoc: string;
    NgPhoneNum: string;
    Ngemail: string;
    NgreEmail: string;
    NgDate: string;
    NgTime: string;
    NgPassengers: string;
    NgCustReviews: string;

    @Input()
  values: DropdownValue[];

  @Input()
  timeValues: string[];

  @Input()
  value: string[];

  @Input()
  PassengersList: string[];

  @Output()
  valueChange: EventEmitter<any>;

  dateString: string;
  timeString: string;


    constructor(private router: Router, private _customerService: CustomerService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {
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
      this.custExist = new Bool;
      //this.custEmail = new CustEmail;
      this.clearSearch = false;

      this.pauseChecking = true;

      this.enableDeleteComments = false;

      this.nonCustomer = false;

      this.FullCusName = '';

      this.valueChange = new EventEmitter();
    }

    ngOnInit(){     

      let firstNameStoredToken:string = localStorage.getItem(this.firstnameTokenKey);
       if(!firstNameStoredToken)  // if anything "throw" error, then API call methods will be disabled since application has "error"
          {
            console.log("New Customer")
          }
        if(firstNameStoredToken)
          {
            this.firstNameStored = firstNameStoredToken.replace(/["']/g,'');
            console.log("Existing Customer returned: " +firstNameStoredToken)
            this.NgfirstName = this.firstNameStored

            this.clearSearch = true;
          }
      
      let lastNameStoredToken:string = localStorage.getItem(this.lastnameTokenKey);
        if(lastNameStoredToken)
          {
            this.lastNameStored = lastNameStoredToken.replace(/["']/g,'');
            this.NgLastName = this.lastNameStored
          }

      let toLocStoredToken:string = localStorage.getItem(this.toLocTokenKey);
        if(toLocStoredToken)
          {
            this.toLocStored = toLocStoredToken.replace(/["']/g,'');
            this.NgDropOffLoc = this.toLocStored
          }
      
      let fromLocStoredToken:string = localStorage.getItem(this.fromLocTokenKey);
        if(fromLocStoredToken)
          {
            this.fromLocStored = fromLocStoredToken.replace(/["']/g,'');
            this.NgPickUpLoc = this.fromLocStored
          }

      let passengersStoredToken:string = localStorage.getItem(this.passengersTokenKey);
        if(passengersStoredToken)
          {
            this.passengersStored = passengersStoredToken.replace(/["']/g,'');
            this.NgPassengers = this.passengersStored
          }

      let emailAddStoredToken:string = localStorage.getItem(this.emailaddTokenKey);
        if(emailAddStoredToken)
          {
            this.emailAddStored = emailAddStoredToken.replace(/["']/g,'');
            // this.Ngemail = this.emailAddStored
            // this.NgreEmail = this.emailAddStored
            this.Ngemail = "";
            this.NgreEmail = "";
          }
      
      let pickedDateStoredToken:string = localStorage.getItem(this.pickedDateTokenKey);
        if(pickedDateStoredToken)
          {
            this.pickedDateStored = pickedDateStoredToken.replace(/["']/g,'');
            this.NgDate = this.pickedDateStored
          }
      
      let pickUpTimeStoredToken:string = localStorage.getItem(this.pickUpTimeTokenKey);
        if(pickUpTimeStoredToken)
          {
            this.pickUpTimeStored = pickUpTimeStoredToken.replace(/["']/g,'');
            this.NgTime = this.pickUpTimeStored
          }
      
      let phoneNumStoredToken:string = localStorage.getItem(this.phoneNumTokenKey);
        if(phoneNumStoredToken)
          {
            this.phoneNumStored = phoneNumStoredToken.replace(/["']/g,'');
            this.NgPhoneNum = this.phoneNumStored
          }



          // Load all customer Reviews
          this.GetAllComments();


      let storedToken:string = localStorage.getItem(this.tokenKey);
        if(!storedToken)  
          {
            console.log("no token found")
            this.enableDeleteComments = false;
          }
        else{
          console.log(storedToken)

          if(storedToken.indexOf("mehboob@mail.commehboob"))
            {
              this.enableDeleteComments = true;
            }
        }
     



      // GOOGLE MAPS AUTOCOMPLETE
      this.mapsAPILoader.load().then (
        () => {
          let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {types:["address"]});

          autocomplete.addListener("place_changed", () => {
            this.ngZone.run(() => {
              let place: google.maps.places.PlaceResult = autocomplete.getPlace();

              if(place.geometry === undefined || place.geometry === null){
                return;
              }
            });
          });
        }
      );

      this.mapsAPILoader.load().then (
        () => {
          let autocomplete = new google.maps.places.Autocomplete(this.searchElement2.nativeElement, {types:["address"]});

          autocomplete.addListener("place_changed", () => {
            this.ngZone.run(() => {
              let place: google.maps.places.PlaceResult = autocomplete.getPlace();

              if(place.geometry === undefined || place.geometry === null){
                return;
              }
            });
          });
        }
      );
    


      //Pick Up Date
      this.value = [];
      for(var i= 0; i <10;) {

          var newDate = new Date(Date.now() + i * 24*60*60*1000);
          this.dateString = newDate.toISOString().slice(0,10);
          console.log(this.dateString);
          this.value.push(this.dateString);
          i++;
          console.log()
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

      for(var i= 1; i <13;) {
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
        for(var i= 1; i <12;) {
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

        this.PassengersList = ['1','2','3','4','5'];

}




FillLocation(event){
  if(this.NgPickUpLoc.toUpperCase() == 'DFW'){

    this.NgPickUpLoc = 'DFW Airport, TX'
  }

  if(this.NgPickUpLoc.toUpperCase() == 'DALLAS FORT WORTH'){

    this.NgPickUpLoc = 'DFW Airport, TX'
  }
  
  if(this.NgPickUpLoc.toUpperCase() == 'DALLAS LOVE FIELD'){

    this.NgPickUpLoc = 'Dallas Love Field Airport, TX'
  }

  // if(this.NgPickUpLoc.toUpperCase() == 'DAL'){

  //   this.NgPickUpLoc = 'Dallas Love Field, TX'
  // }



  if(this.NgDropOffLoc.toUpperCase() == 'DFW'){
    
    this.NgDropOffLoc = 'DFW Airport, TX'
  }
  
  if(this.NgDropOffLoc.toUpperCase() == 'DALLAS FORT WORTH'){
    
    this.NgDropOffLoc = 'DFW Airport, TX'
  }

  if(this.NgDropOffLoc.toUpperCase() == 'DALLAS LOVE FIELD'){
    
    this.NgDropOffLoc = 'Dallas Love Field Airport, TX'
  }

  // if(this.NgDropOffLoc.toUpperCase() == 'DAL'){
    
  //   this.NgDropOffLoc = 'Dallas Love Field, TX'
  // }
  //DAL
}


FillLocationOnChange(event){

if(this.NgPickUpLoc.toUpperCase().includes('DFW')){

    this.NgPickUpLoc = 'DFW Airport, TX'
  }

if(this.NgPickUpLoc.toUpperCase().includes('DALLAS FORT WORTH')){

    this.NgPickUpLoc = 'DFW Airport, TX'
  }

if(this.NgPickUpLoc.toUpperCase().includes('DALLAS LOVE FIELD')){

    this.NgPickUpLoc = 'Dallas Love Field Airport, TX'
  }

// if(this.NgPickUpLoc.toUpperCase().includes('DAL')){

//     this.NgPickUpLoc = 'Dallas Love Field, TX'
//   }



if(this.NgDropOffLoc.toUpperCase().includes('DFW')){
    
    this.NgDropOffLoc = 'DFW Airport, TX'
  }
//DALLAS FORT WORTH
if(this.NgDropOffLoc.toUpperCase().includes('DALLAS FORT WORTH')){
    
    this.NgDropOffLoc = 'DFW Airport, TX'
  }

if(this.NgDropOffLoc.toUpperCase().includes('DALLAS LOVE FIELD')){
    
    this.NgDropOffLoc = 'Dallas Love Field Airport, TX'
  }

// if(this.NgDropOffLoc.toUpperCase().includes('DAL')){
    
//     this.NgDropOffLoc = 'Dallas Love Field, TX'
//   }

}





  GetAllComments() {

    var result = this._customerService.getAllReviews();
          result.subscribe(reviews => {
            this.allCustomerReviews = reviews;
             console.log(reviews);
             console.log(this.allCustomerReviews);
    });



  }



  addComment(Comment) {

  let firstNameStoredToken:string = localStorage.getItem(this.firstnameTokenKey);

   if(firstNameStoredToken && firstNameStoredToken != 'undefined') 
    {

    console.log(this.firstNameStored+" "+this.lastNameStored);
    this.FullCusName = this.firstNameStored+" "+this.lastNameStored;

      var result;

      var TodayDate = new Date(Date.now()).toISOString().slice(0,10);

      var ReviewObj = {
          comment: Comment,
          CommentDate: TodayDate,
          FullCustomerName: this.FullCusName
          
      };

      var newReviews = {
        Reviews: Comment.toString(), //must convert to string before passing into array of "any"
        CommentDate: TodayDate,
        FullCusName: this.FullCusName
      }
    

  
      console.log(this.allCustomerReviews);
      
      if(Comment != '' && Comment != null)
        {
            console.log(ReviewObj.comment);

            this.allCustomerReviews.unshift(newReviews); // add comment to the array

            result = this._customerService.AddReview(ReviewObj);  // add comment to DB
              result.subscribe(x => {
                console.log("comment sent to DB");
                        this.NgCustReviews = '';
            });

        }

    }
    
    else {

        this.nonCustomer = true;
    }

  }


DeleteComment(Comment, index){

        var result;

        var ExistingComment = {
        Review: Comment
      }

      this.allCustomerReviews.splice(index, 1); // add comment to the array

          result = this._customerService.DeleteReview(ExistingComment);  // add comment to DB
          result.subscribe(x => {
             console.log("comment Deleted in DB");
        });

}



clearPreviousSearch() {

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
}

PhoneNumChange(){
  //if (this.NgPhoneNum.length > 10)
    this.NgPhoneNum.replace('(','').replace(')','').replace('-','')
  console.log(this.NgPhoneNum);
}

// UpdatePhoneUI(event){

//   var k = event.keyCode; 
//   if(k.length >= 3)
//     {
//       console.log(k)
//       console.log(k.length)
//       this.NgPhoneNum = "("+this.NgPhoneNum+")"
//     }
// }


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


//style="display: inline-block; float: none;"



omit_special_char(event)
{   
   var k;  
   k = event.charCode;  //         k = event.keyCode;  (Both can be used)
   return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
}


  emailDupCheck(email: string){

    this.custEmail = [];

     console.log(email + " This is the email we are searching for in the DB");
     this.pauseChecking = true

    var NewEmail = {
        EmailAddr: email
      };

              var result = this._customerService.getExisitingEmail(email)
                result.subscribe(existingemail => {

                  // if(existingemail != null)
                  //   {
                      this.custEmail.push(existingemail);
                      console.log(this.custEmail);
                 //   }
                  // else
                  //   {
                  //     this.custEmailNonExi = true;
                  //   }
                  this.pauseChecking = false

                });
              
  }

  

  ReturnTolanding(){
    this.router.navigate(['./RequestSubmitted']);
  }


    
  select(value) {
    this.valueChange.emit(value);
  }



    addDatCust(nameText: string){
     var result;
     var name = {
        custName: nameText
     } 

      console.log(nameText + 'inside request ride component dot ts')
    result = this._customerService.saveOneCus(name);
    //console.log(result + 'the result of customerservice dot save one cus')
    result.subscribe(x => {
    this.Datname.push(name);
      //console.log(this.Datname + 'this is name dot ts variable output')
      });
  }

    
    addNewCustomer(firstname: string, lastname: string, pickUpLoc: string, dropoffloc: string, phonenum: string, emailadd: string, pickedDate: string, pickUpTime: string, numOfPassengers: string){
    
      localStorage.clear(); // clear old customer data from local storage so we can save new customer data!

      // this.custEmail = [];
        
      
      // Replace special characters and spaces in phone number for API call
          //console.log(phonenum);
          var replacePhone = phonenum.replace(/[()]/g,'').replace(/[-]/g,'').replace(' ','');
          //console.log(replacePhone);
          var newPhonenum =  Number(replacePhone);
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
            result.subscribe(x => {
              this.customer.push(x);

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

            this.onComplete(); // method to go to next page (confirm request page)

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

        
  }


   log(x: any) 
    {
     console.log(x);
     console.log(this.searchElement);
    }

    onComplete()
    {
      //this.router.navigate(['./RequestSubmitted']);
      this.router.navigate(['./ConfirmInfo'], { queryParams: { page: this.sum } });
    }

    onSubmit(){
        console.log('form submit clicked..');
    }

    AdminPortal()
    {
      this.router.navigate(['./AdminPortal']);
    }
}






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