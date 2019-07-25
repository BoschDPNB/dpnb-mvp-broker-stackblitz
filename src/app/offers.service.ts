import { Injectable } from '@angular/core';
//import { suppliersProposal } from './suppliers-proposal';
import { Subject } from 'rxjs/Subject';
import { Request } from './models/request.model';

@Injectable()
export class OffersService {
  private order_id: string;
  private order: Request;


  constructor() { }

  getMinRating(){
    return this.order.min_rating;  
  }

  getMaxPrice(){
    return this.order.max_price;  
  }

  getDelDate(){
    return this.order.delivery_date;  
  }

  getAmount(){
    return this.order.amount;
  }
  
  getOrderId(){
    return this.order_id;
  }

  setOrderId(newId){
    this.order_id = newId;
  }

  setOrder(newOrder){
    this.order = newOrder;
  }

}