import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { Proposal } from '../models/proposal.model';
import { OffersService } from '../offers.service'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choice-of-suppliers',
  templateUrl: './choice-of-suppliers.component.html',
  styleUrls: ['./choice-of-suppliers.component.css']
})
export class ChoiceOfSuppliersComponent implements OnInit {
  choiceSupplierForm;
  choice: FormControl;

  suppliersProposal: Proposal[];
  order_id: string;

  constructor(
    private formBuilder: FormBuilder,
    private offersService: OffersService,
    private httpClient: HttpClient,
    private router: Router,
  ) {}

  ngOnInit(){
    if(!this.offersService.getMaxPrice()){
      let maxPrice = 30;
    }
    else{
      let maxPrice = this.offersService.getMaxPrice();
    }
    if(!this.offersService.getDelDate()){
      let delDate = Date.now()+2*604800000;
    }
    else{
      let delDate = new Date(this.offersService.getDelDate()).getTime();
    }
    if(!this.offersService.getMinRating()){
      let minRating = 0;
    }
    else{
      let minRating = this.offersService.getMinRating();
    }
      this.suppliersProposal=[new Proposal(
        Math.round(maxPrice*this.offersService.getAmount() - Math.random()*100),
        new Date(delDate - Math.random()* 604800000),
        Math.round( Math.random() * (5.0-minRating) * 10.0 )/10 + Number(minRating),
      )];
      for(let i=0; i<2; i++){
        this.suppliersProposal.splice(0,0,new Proposal(
          Math.round(maxPrice*this.offersService.getAmount() - Math.random()*100),
          new Date(delDate - Math.random()* 604800000),
          Math.round( Math.random() * (5.0-minRating) * 10.0 )/10 + Number(minRating),
        ));}
    

    this.choice = new FormControl('', Validators.required);
    this.order_id=this.offersService.getOrderId()["name"];
    this.choiceSupplierForm = this.formBuilder.group({
        'choice': this.choice,

    })
  }

  onSubmit(choiceSupplier){
  const accept = {offer: choiceSupplier["choice"]};
  
  this.httpClient
      .put<Request>('https://dpnb-broker.firebaseio.com/offers/'+this.order_id+'/accept.json', accept)
      .subscribe(
        (val) => {
          console.log("Data submitted: ", accept, " -- ", val);
        },
        error => {
          console.log('Erreur ! : ' + error);
        },
        () =>{
          console.log('Data saved');
        },
      );
  this.router.navigate(['order-confirmation']);  

  }
}