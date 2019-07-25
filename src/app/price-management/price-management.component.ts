import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../models/user.model';
import { Capacity } from '../models/capacity.model';
import { Discount } from '../models/discount.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-price-management',
  templateUrl: './price-management.component.html',
  styleUrls: ['./price-management.component.css']
})
export class PriceManagementComponent implements OnInit {
  loggedUser: User;
  userSubscription: Subscription;
  public myGroup: FormGroup;
  public priceManagementForm: FormGroup;
  categories: String[]; //either machines or trucks

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private httpClient: HttpClient,
    private router: Router,
  ) {}
  
  addDiscounts(){
    const control = <FormArray>this.priceManagementForm.controls['discounts'];
    control.push(this.formBuilder.group({
        date: [''],
        percentage: [''],
        availability: ['']
      }));
  }


  ngOnInit() {
    if(this.authService.getActualUser()){
      this.userSubscription = this.authService.userSubject.subscribe(
        (user: User) => {
          this.loggedUser = user;
          if(user.role=="production"){
            this.categories=user.machines;
          }
          else{
            this.categories=user.trucks;
          }
        }
      );
      this.authService.emitUserSubject();
    }
    this.priceManagementForm = this.formBuilder.group({
      discounts: this.formBuilder.array([
        this.formBuilder.group({
          date: [''],
          percentage: [''],
          availability : ['']
        }),
        
      ])
    });
  }

  ngOnDestroy() {
   if(this.authService.getActualUser()){
    this.userSubscription.unsubscribe();
  }
  }

  onSubmitMaterialPrice(materialKost){
    const matPrice=materialKost.value;
    const id = this.loggedUser['id'];
    this.httpClient
      .put('https://dpnb-broker.firebaseio.com/capacities/'+id+'/material_cost.json', matPrice)
      .subscribe(
        (val) => {
          console.warn('Your data have been submitted', matPrice);
        },
        error => {
          console.log('Erreur ! : ' + error);
        },
        () =>{
          console.log('Data saved');
        },
      ); 
  }
  
  onSubmitDiscounts(priceData, k){//k is the index of the machine / truck in categories
    
    const newDiscounts = {
      discounts: this.getDiscounts(priceData),
    };
    const id = this.loggedUser['id'];
    this.httpClient
      .post('https://dpnb-broker.firebaseio.com/capacities/'+id+'/'+this.categories[k]+'.json', newDiscounts)
      .subscribe(
        (val) => {
          console.warn('Your data have been submitted', newDiscounts);
        },
        error => {
          console.log('Erreur ! : ' + error);
        },
        () =>{
          console.log('Data saved');
        },
      );    

    document.getElementById("k").style.display="inline";
    this.priceManagementForm.reset();
    /*setTimeout(
      ()=>{
        this.priceManagementForm.reset();
        this.router.navigate(['/user-stats']);
      }, 2000
    )*/
  }

  onSubmitPrice(preis, k){ //k is the index of the machine / truck in categories
    const price=preis.value;
    const id = this.loggedUser['id'];
    this.httpClient
      .put('https://dpnb-broker.firebaseio.com/capacities/'+id+'/'+this.categories[k]+'/default_price.json', price)
      .subscribe(
        (val) => {
          console.warn('Your data have been submitted', price);
        },
        error => {
          console.log('Erreur ! : ' + error);
        },
        () =>{
          console.log('Data saved');
        },
      ); 
    document.getElementsByClassName("onLeft").style.display="inline";
    /*setTimeout(
      ()=>{
        this.router.navigate(['/user-stats']);
      }, 2000
    )*/
  }

  onSubmitMinPrice(minpreis){
    const minprice= minpreis.value;
    const id = this.loggedUser['id'];
    this.httpClient
      .put('https://dpnb-broker.firebaseio.com/capacities/'+id+'/'+this.categories[k]+'/minimumprice.json', minprice)
      .subscribe(
        (val) => {
          console.warn('Your data have been submitted', minprice);
        },
        error => {
          console.log('Erreur ! : ' + error);
        },
        () =>{
          console.log('Data saved');
        },
      ); 
    setTimeout(
      ()=>{
        this.router.navigate(['/user-stats']);
      }, 2000
    )

  }

  getDiscounts(priceData){
    let res = [];
    
    for (let a in priceData['discounts']){
      console.log(priceData['discounts'][a]);
      if((priceData['discounts'][a]['availability'])===""){
        let  perc= priceData['discounts'][a]['percentage']}
      else{
        let perc =999;
      }
      if((priceData['discounts'][a]['date'])===""){
        continue;}
      else{
        res.push({
          date: priceData['discounts'][a]['date'], 
          percentage: perc,
        })
      }
    }
    return res;
  }

  goToUserStats(){
    this.router.navigate(['/user-stats'])
  }

}
