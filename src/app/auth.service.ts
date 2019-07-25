import { Injectable } from '@angular/core';
import { User } from './models/user.model';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Capacity } from './models/capacity.model';
import { Discount } from './models/discount.model';


@Injectable()
export class AuthService {

  private isAuth = false;
  private actualUser : User;
  private actualUserCapacities: Capacity[]=[];
  userSubject = new Subject<User>();
  capacitiesSubject = new Subject<Capacity[]>();

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

  signIn({username, password}) {
    let passwordServer = '';
    let user = new User();
    const params = new HttpParams().set('orderBy', '"username"').set('equalTo','"'+username+'"');
    this.httpClient
      .get('https://dpnb-broker.firebaseio.com/users.json', {params})
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
            window.alert("Anmeldungdaten wurden nicht erkannt")
          }
        }
      )


  }

  signOut() {
    this.actualUser = undefined;
    this.isAuth= false;
    window.alert("Sie wurden abgemeldet.");
    /*this.router.navigate(['/loading']);
    setTimeout(
      () => this.router.navigate(['/auth']), 500);*/
    this.router.navigate(['/auth']);  
  }

  getStatus(){
    return this.isAuth;
  }

  getActualUser(){
    return this.actualUser;
  }


  getUserCapacities(name:String){
    let userId = this.actualUser.id;
    const params = new HttpParams().set('orderBy', '"$key"').set('equalTo','"'+userId+'"');
    this.httpClient
      .get('https://dpnb-broker.firebaseio.com/capacities.json', {params})
      .subscribe(
        (response: Capacity[]) => {
          let discounts: Discount[]=[];
          for (let elt in response[userId][name]){
            if(elt!="default_price" && elt!="minimumprice"){
              for(let di in response[userId][name][elt]["discounts"]){
                discounts.push( {
                  percentage: response[userId][name][elt]["discounts"][di]["percentage"],
                  date: response[userId][name][elt]["discounts"][di]["date"],
                })     
              }
            }
          }
          this.actualUserCapacities.push({
            default_price: response[userId][name]["default_price"],
            min_price: response[userId]["minimumprice"],
            discounts: discounts,
          })
            
          this.emitCapaSubject;
        }
      )
  }

  getActualUserCapacities(){
    return(this.actualUserCapacities);
  }
  

}
