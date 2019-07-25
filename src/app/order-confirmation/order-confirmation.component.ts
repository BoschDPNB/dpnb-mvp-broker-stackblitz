import { Component, OnInit } from '@angular/core';
import { OffersService } from '../offers.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {

  order_id: String;

  constructor(
    private offersService: OffersService,
    private router: Router,
  ) { }

  ngOnInit() {
    if(this.offersService.getOrderId()){
      this.order_id=this.offersService.getOrderId()["name"];

    }
  }

  goToHome(){
    this.router.navigate(['index']);
  }

  goToOrderStat(){
    this.router.navigate(['order-status']);
  }

}