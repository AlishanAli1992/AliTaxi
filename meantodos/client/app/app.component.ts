import { Component } from '@angular/core';
import {TodoService} from './services/todo.service';
import {CustomerService} from './services/customer.service';
import { Router }   from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  styles: [` 




  `],

  providers: [TodoService, CustomerService],


})

export class AppComponent { 

ImagePath: string;


    constructor(private router: Router) {
      this.ImagePath = 'app/assets/PrimaryFlatLogo.png';
    }


AdminPortal()
    {
      this.router.navigate(['./AdminPortal']);
    }



}

    // background-image: url('/app/assets/background.jpg');