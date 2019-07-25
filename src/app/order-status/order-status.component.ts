import { Component, OnInit, Input } from '@angular/core';
import { OffersService } from '../offers.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.css']
})
export class OrderStatusComponent implements OnInit {
//-LjpSqMXRmiiIu_7AXzz
  order_id: String ;
  temperature: number;
  dispersion: number;


  constructor(
    private offersService: OffersService,
    private httpClient: HttpClient,
  ) { }

  updateId(id){
    this.offersService.setOrderId(null);
    this.order_id = id.value;
    this.ngOnInit();
    this.temperature=null;
    this.dispersion=null;    
  }

  ngOnInit() {
    if(this.offersService.getOrderId()){
      this.order_id=this.offersService.getOrderId()["name"];
      console.log(this.offersService.getOrderId()["name"]);
    }
    if(this.order_id){

      const params = new HttpParams().set('orderBy', '"$key"').set('equalTo','"'+this.order_id+'"');
      this.httpClient
        .get('https://dpnb-broker.firebaseio.com/orders.json', {params})
        .subscribe(
          (response) => {
            console.log(response[this.order_id]);
            if(response[this.order_id]["status"]["temperature"]){
              this.temperature=response[this.order_id]["status"]["temperature"];
            }
            if(response[this.order_id]["status"]["dispersion"]){
              this.dispersion=response[this.order_id]["status"]["dispersion"];
            }
      })
    }
  }

}