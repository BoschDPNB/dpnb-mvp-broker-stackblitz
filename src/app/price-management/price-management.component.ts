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

  machine_list=["SMALL_SIMPLEX","SMALL_DUPLEX", "SMALL_SUPPORT", "LARGE_SIMPLEX", "LARGE_DUPLEX", "LARGE_SUPPORT"];
  truck_list=["PKW_CADDY", "_7T_FAHRZEUG", "_40T_FAHRZEUG"];

  machine_eq={
    SMALL_SIMPLEX: "Kleiner 3D-Drucker, Einfarbig",
    SMALL_DUPLEX: "Kleiner 3D-Drucker, Zweifarbig",
    SMALL_SUPPORT: "Kleiner 3D-Drucker, Mit Stützmaterial",
    LARGE_SIMPLEX: "Großer 3D-Drucker, Einfarbig",
    LARGE_DUPLEX: "Großer 3D-Drucker, Zweifarbig",
    LARGE_SUPPORT: "Großer 3D-Drucker, Mit Stützmaterial",
    PKW_CADDY:"PKW Caddy",
    _7T_FAHRZEUG:"LKW 7,5to",
    _40T_FAHRZEUG:"LKW 40to",
  }

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
        enddate: [''],
        percentage: [''],
        capacity: [''],
        availability: ['']
      }));
  }


  ngOnInit() {
    if(this.authService.getActualUser()){
      this.userSubscription = this.authService.userSubject.subscribe(
        (user: User) => {
          this.loggedUser = user;
          if(user.role=="production" && user.machines){
            this.categories=[];
            for(let item in this.machine_list){
              if(user.machines[this.machine_list[item]]>0){
                this.categories.push(this.machine_list[item])
              }
              
            };
          }
          else{ if(user.trucks){
            this.categories=[];
            for(let item in this.truck_list){
              if(user.trucks[this.truck_list[item]]>0){
                this.categories.push(this.truck_list[item])
              }
              
            };
          }}
        }
      );
      this.authService.emitUserSubject();
    }
    this.priceManagementForm = this.formBuilder.group({
      discounts: this.formBuilder.array([
        this.formBuilder.group({
          date: [''],
          enddate: [''],
          percentage: [''],
          capacity: [''],
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
      .put('https://dpnb-mvp.firebaseio.com//capacities/'+id+'/material_cost.json', matPrice)
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
    materialKost.value="";
    window.scrollTo(0, 0);
    document.getElementById("confirmation").style.display="inline";
    setTimeout(
      ()=>{
        document.getElementById("confirmation").style.display="none";
      }, 4000
    )
  }
  
  onSubmitDiscounts(priceData, k){//k is the index of the machine / truck in categories
    
    const newDiscounts = {
      discounts: this.getDiscounts(priceData),
    };
    const id = this.loggedUser['id'];
    this.httpClient
      .post('https://dpnb-mvp.firebaseio.com//capacities/'+id+'/'+this.categories[k]+'.json', newDiscounts)
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

    this.priceManagementForm.reset();
    window.scrollTo(0, 0);
    document.getElementById("confirmation").style.display="inline";
    setTimeout(
      ()=>{
        document.getElementById("confirmation").style.display="none";
      }, 4000
    )
  }

  onSubmitPrice(preis, k){ //k is the index of the machine / truck in categories
    const price=preis.value;
    const id = this.loggedUser['id'];
    this.httpClient
      .put('https://dpnb-mvp.firebaseio.com//capacities/'+id+'/'+this.categories[k]+'/default_price.json', price)
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
    preis.value="";
    window.scrollTo(0, 0);
    document.getElementById("confirmation").style.display="inline";
    setTimeout(
      ()=>{
        document.getElementById("confirmation").style.display="none";
      }, 4000
    )
    
  }

  onSubmitMinPrice(minpreis, k){
    const minprice= minpreis.value;
    const id = this.loggedUser['id'];
    this.httpClient
      .put('https://dpnb-mvp.firebaseio.com//capacities/'+id+'/'+this.categories[k]+'/min_price.json', minprice)
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
    minpreis.value="";
    window.scrollTo(0, 0);
    document.getElementById("confirmation").style.display="inline";
    setTimeout(
      ()=>{
        document.getElementById("confirmation").style.display="none";
      }, 4000
    )
  }


  onSubmitSetupPrice(setuppreis, k){
    const setupprice= setuppreis.value;
    const id = this.loggedUser['id'];
    this.httpClient
      .put('https://dpnb-mvp.firebaseio.com//capacities/'+id+'/'+this.categories[k]+'/setup_price.json', setupprice)
      .subscribe(
        (val) => {
          console.warn('Your data have been submitted', setupprice);
        },
        error => {
          console.log('Erreur ! : ' + error);
        },
        () =>{
          console.log('Data saved');
        },
      ); 
    setuppreis.value="";
    window.scrollTo(0, 0);
    document.getElementById("confirmation").style.display="inline";
    setTimeout(
      ()=>{
        document.getElementById("confirmation").style.display="none";
      }, 4000
    )
  }

  getDiscounts(priceData){
    let res = [];
    
    for (let a in priceData['discounts']){
      console.log(priceData['discounts'][a]);
       if((priceData['discounts'][a]['capacity'])==""){

        let capa =priceData['discounts'][a]['enddate'];

        }
      else{
        
        let capa =priceData['discounts'][a]['capacity'];
      }
      if((priceData['discounts'][a]['availability'])===""){
        }
      else{
        let capa =0;
      }
      if((priceData['discounts'][a]['date'])===""){
        continue;}
      else{
        res.push({
          date: priceData['discounts'][a]['date'],
          enddate: priceData['discounts'][a]['enddate'],
          capacity: capa,  
          percentage: priceData['discounts'][a]['percentage'],
        })
      }
    }
    return res;
  }

  goToUserStats(){
    this.router.navigate(['/user-stats'])
  }

}
