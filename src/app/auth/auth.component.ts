import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  authForm;

  loggedUser: User; //Stores the user that is logged in. Is null if noone is logged in
  userSubscription: Subscription;

  username: FormControl;
  password: FormControl;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {}

   

  ngOnInit() {
    //SET THE FORM
    this.username= new FormControl('', Validators.required);
    this.password= new FormControl('', Validators.required);
    this.authForm = this.formBuilder.group({
      'username': this.username,
      'password': this.password,
    });

    this.userSubscription = this.authService.userSubject.subscribe(
      (user: User) => {
        this.loggedUser = user;
      }
    );
    this.authService.emitUserSubject();
    console.log("loggedUser: ", this.loggedUser);
  }



  ngOnDestroy() {
    if(this.authService.actualUser){
      this.userSubscription.unsubscribe();
    }
  }

  onSubmit(authData){
    this.authService.signIn(authData);
  }

  onSignOut() {
    this.authService.signOut();
  }

  goToStats(){
    this.router.navigate(['/user-stats']);
  }

  goToRegistration(){
    this.router.navigate(['/supplier-registration']);
  }

}