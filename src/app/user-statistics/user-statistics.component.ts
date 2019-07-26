import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { Capacity } from '../models/capacity.model';
import { CapacityMachine } from '../models/capacityMachine.model';

@Component({
  selector: 'app-user-statistics',
  templateUrl: './user-statistics.component.html',
  styleUrls: ['./user-statistics.component.css']
})
export class UserStatisticsComponent implements OnInit {

  loggedUser: User;
  userSubscription: Subscription;
  capa_obj: {};
  capacities: Capacity[];
  capaSubscription: Subscription;
  matCostSubscription: Subscription;
  material_cost: number;
  categories: String[]; //trucks or machines

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }
  
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
  machine_list=["SMALL_SIMPLEX","SMALL_DUPLEX", "SMALL_SUPPORT", "LARGE_SIMPLEX", "LARGE_DUPLEX", "LARGE_SUPPORT"];
  truck_list=["PKW_CADDY", "_7T_FAHRZEUG", "_40T_FAHRZEUG"];
  
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
    };
    
    let k=0;
   // while (this.categories[k]){
    //  this.authService.getUserCapacities(this.categories[k]);
    this.authService.getUserCapacities();
      this.capa_obj={};
      if(this.authService.getActualUserCapacities()){
        this.capaSubscription = this.authService.capacitiesSubject.subscribe(
          (capa:Capacity) => {
            //console.log(capa.length);
            console.log("capa :", capa);
            for(let i in capa){
              for(let k in i){
              
              console.log("k.material_cost :", k.material_cost);
              console.log(",capa[i][k].material_cost :",capa[i][k].material_cost)
              //console.log(capa);
              //console.log(capa[i].default_price)
            }}
            /*for(let i in capa){
              console.log(i)
            }*/
            this.capacities = capa;
            this.capa_obj[this.categories[k]]=capa;
            
        });
      
      this.authService.emitCapaSubject();};
      k++;
      //console.log(this.capa_obj)  ;
    
  }

  ngOnDestroy(){
    if(this.capacities){
      this.capacities.splice(0,this.capacities.length);
    }
  }

  goToPriceManagement(){
    this.router.navigate(['/price-management'])
  }

  onSignOut() {
    this.authService.signOut();
  
  }

}
