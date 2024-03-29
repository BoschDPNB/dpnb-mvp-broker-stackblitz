import { Injectable } from '@angular/core';
import { User } from './models/user.model';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Capacity } from './models/capacity.model';
import { CapacityMachine } from './models/capacityMachine.model';
import { Discount } from './models/discount.model';


@Injectable()
export class AuthService {

  private isAuth = false;
  private actualUser : User;
  private actualUserCapacities:Capacity=new Capacity();
  userSubject = new Subject<User>();
  capacitiesSubject = new Subject<Capacity>();
  matCostSubject = new Subject<number>();

  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) { }
  
 
  emitUserSubject(){
    this.userSubject.next(this.actualUser);
  }
  emitCapaSubject(){
    this.capacitiesSubject.next(this.actualUserCapacities);
  }

  emitMatCost(){
    this.matCostSubject.next(this.material_cost);
  }

  signIn({username, password}) {
    let passwordServer = '';
    let user = new User();
    const params = new HttpParams().set('orderBy', '"username"').set('equalTo','"'+username+'"');
    this.httpClient
      .get('https://dpnb-mvp.firebaseio.com//users.json', {params})
      .subscribe(
        data => {
          for(let a in data){passwordServer = data[a]['password']; user = data[a]; user['id'] = a};
          console.log("gegeben: ", password, " / gespeichert: ", passwordServer);
   
          if(passwordServer == password )
          {
            this.isAuth = true;
            this.actualUser = user; 
            this.emitUserSubject; 
            console.log("Sign In successful !");
            this.router.navigate(['/user-stats']);
          }
          else{
            window.alert("Anmeldedaten wurden nicht erkannt")
          }
        }
      )


  }

  signOut() {
    this.actualUser = undefined;
    this.isAuth= false;
    window.alert("Sie wurden abgemeldet.");
    this.router.navigate(['/auth']);  
  }

  getStatus(){
    return this.isAuth;
  }

  getActualUser(){
    return this.actualUser;
  }


  getUserCapacities(){
    let userId = this.actualUser.id;
    const params = new HttpParams().set('orderBy', '"$key"').set('equalTo','"'+userId+'"');
    this.httpClient
      .get('https://dpnb-mvp.firebaseio.com/capacities.json', {params})
      .subscribe(
        (response: Capacity[]) => {
          let capacityMachineObj={};
          for(let name in response[userId]){
            
          let discounts: Discount[]=[];
            if(name!="material_cost"){
              
          for (let elt in response[userId][name]){
            if(elt!="default_price" && elt!="minimumprice"){
              for(let di in response[userId][name][elt]["discounts"]){
                discounts.push( {
                  percentage: response[userId][name][elt]["discounts"][di]["percentage"],
                  capacity: response[userId][name][elt]["discounts"][di]["capacity"],
                  date: response[userId][name][elt]["discounts"][di]["date"],
                  enddate: response[userId][name][elt]["discounts"][di]["enddate"],
                })     
              }
            }
          }
          let newCapa:CapacityMachine={
            default_price: response[userId][name]["default_price"],
            setup_price: response[userId][name]["setup_price"],
            min_price: response[userId][name]["min_price"],
            discounts: discounts,
          }
          console.log(newCapa);
          capacityMachineObj[name]=newCapa;
          //this.actualUserCapacities[name]=(newCapa)
          }
          else{
            this.actualUserCapacities["material_cost"]=response[userId]["material_cost"]
          }
          }
          this.actualUserCapacities["capacitiesMachine"]=capacityMachineObj;
          this.emitCapaSubject;
          console.log("actualUserCapacities" ,this.actualUserCapacities)
        }
      )
  }

  getActualUserCapacities(){
    return(this.actualUserCapacities);
  }
  
  material_cost: number;


}
