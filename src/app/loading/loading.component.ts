import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OffersService } from '../offers.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  order_id: String;

  constructor(
    private router: Router,
    private offersService: OffersService,
  ) { }

  ngOnInit() {
    this.order_id=this.offersService.getOrderId()["name"];
    setTimeout(
      () => this.router.navigate(['choice-of-suppliers']) ,5000
    )
  }

  goToDemandRegistration(){
    this.router.navigate(['demand-registration']);
  }

}