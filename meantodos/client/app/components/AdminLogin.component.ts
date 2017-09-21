import { Component, OnInit, Input, Output, EventEmitter, Injectable } from '@angular/core';
import { HostListener } from '@angular/core';
import { PlatformLocation } from '@angular/common'
import { Router }   from '@angular/router';

import {CustomerService} from '../services/customer.service';
import {Customer} from '../Customer';
import {AdminUser} from '../AdminUser';


@Component({
  moduleId: module.id,
  selector: 'AdminLogin',
  templateUrl: 'AdminLogin.component.html',
  styles: [`
.loginmodal-container {
    padding: 30px;
    max-width: 350px;
    width: 100% !important;
    background-color: #F7F7F7;
    margin: 0 auto;
    border-radius: 2px;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    font-family: roboto;
}

.loginmodal-container h1 {
  text-align: center;
  font-size: 1.8em;
  font-family: roboto;
}

.loginmodal-container input[type=submit] {
  width: 100%;
  display: block;
  position: relative;
}

.loginmodal-container input[type=text], input[type=password] {
  height: 44px;
  font-size: 16px;
  width: 100%;
  -webkit-appearance: none;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-top: 1px solid #c0c0c0;
  /* border-radius: 2px; */
  padding: 0 8px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
}

.loginmodal-container input[type=text]:hover, input[type=password]:hover {
  border: 1px solid #b9b9b9;
  border-top: 1px solid #a0a0a0;
  -moz-box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
  -webkit-box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
}

.loginmodal {
  text-align: center;
  font-size: 14px;
  font-family: 'Arial', sans-serif;
  font-weight: 700;
  height: 36px;
  padding: 0 8px;
/* border-radius: 3px; */
/* -webkit-user-select: none;
  user-select: none; */
}

.loginmodal-submit {
  /* border: 1px solid #3079ed; */
  border: 0px;
  color: #fff;
  text-shadow: 0 1px rgba(0,0,0,0.1); 
  background-color: #4d90fe;
  padding: 17px 0px;
  font-family: roboto;
  font-size: 14px;
  /* background-image: -webkit-gradient(linear, 0 0, 0 100%,   from(#4d90fe), to(#4787ed)); */
}

.loginmodal-submit:hover {
  /* border: 1px solid #2f5bb7; */
  border: 0px;
  text-shadow: 0 1px rgba(0,0,0,0.3);
  background-color: #357ae8;
  /* background-image: -webkit-gradient(linear, 0 0, 0 100%,   from(#4d90fe), to(#357ae8)); */
}

.loginmodal-container a {
  text-decoration: none;
  color: #666;
  font-weight: 400;
  text-align: center;
  display: inline-block;
  opacity: 0.6;
  transition: opacity ease 0.5s;
} 

.login-help{
  font-size: 12px;
}
  `]
})
export class AdminLoginComponent implements OnInit { 

    NgUsername: string;
    NgPassword: string;
    //adminUser: AdminUser[];
    adminUser: any;
    serviceLoading: boolean;
    wrongCred: boolean;
    private tokenKey:string = 'app_token';
    subscription: any;
    adminUsername: string;
    adminPassword: string;



    constructor(private router: Router, private _customerService: CustomerService, location: PlatformLocation) {

      location.onPopState(() => {

        this.router.navigate(['.']);
        console.log('pressed back!');

    });

      this.NgUsername = "";
      this.NgPassword = '';
      this.adminUser = new AdminUser();
      this.wrongCred = false;
    }

     ngOnInit(){  
       let storedToken:string = localStorage.getItem(this.tokenKey);
        if(!storedToken)  // if anything "throw" error, then API call methods will be disabled since application has "error"
          {
            console.log("no token found")
          }
        else{
          console.log(storedToken)
          //if(storedToken.indexOf("SignedIn"))
          if(storedToken.indexOf(this.adminUsername+this.adminPassword))
            {
              this.AdminPortal();
            }
        }
     }
    


    LoginAdmin(username: string, password: string){
      console.log(username);
      console.log(password);
      
      this.serviceLoading = true;

      var result;

      var adminCred = {
        Username: username,
        Password: password
      };

      console.log(adminCred);

      this.subscription =  result = this._customerService.getAdminUser(adminCred);
        result.subscribe(x => {
          this.adminUser = x;
          if(this.adminUser != 0) // 0 is to check if object is undefinied
            {
              this.serviceLoading = false;
              if(this.adminUser[0].Username == username && this.adminUser[0].Password == password)
                  {
                    this.AdminPortal();
                    this.adminUsername = this.adminUser[0].Username;
                    this.adminPassword = this.adminUser[0].Password;
                    localStorage.setItem(this.tokenKey, JSON.stringify(this.adminUsername+this.adminPassword));
                    //localStorage.setItem(this.tokenKey, JSON.stringify("SignedIn"));
                    username = '';
                    password = '';
                    this.adminUser = {};
                    
                  }
            }
          else
            {
              this.serviceLoading = false;
              this.wrongCred = true;                            
            }
          
            
    }); 
            
    }

   log(x: any) 
    {
     console.log(x);
    }

    onSubmit(){
        console.log('form submit clicked..');
    }

    AdminPortal()
    {
      this.router.navigate(['./AdminPortal']);
    }
}
