import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Request } from '../models/request.model';
import { Address } from '../models/address.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OffersService } from '../offers.service';
import { imagesUrl } from '../imagesUrl';

@Component({
  selector: 'app-demand-registration',
  templateUrl: './demand-registration.component.html',
  styleUrls: ['./demand-registration.component.css']
})
export class DemandRegistrationComponent implements OnInit {
  demandRegistrationForm;
  orderId: String;

  ein= imagesUrl["ein"];
  zwei= imagesUrl["zwei"];
  stutz= imagesUrl["stutz"];
  zweistutz= imagesUrl["zweistutz"];

  company_name: FormControl;
  delivery_address: FormGroup;
    street: FormControl;
    nb: FormControl;
    postal_code: FormControl;
    city: FormControl; 
  product_id: FormControl;
  amount: FormControl;
  delivery_date: FormControl;
  max_price: FormControl;
  min_rating: FormControl;
  required_qualifications: FormArray;
  quality_measurements: FormArray;
  required_abilities: FormArray;

  qualifications = [
    { id: 1, quali: 'ISO 9001' }, 
    { id: 2, quali: 'ISO 14001' },
    { id: 3, quali: 'ISO 10303' } 
  ];

  requiredAbilities = [
    //{ id: 'ASSEMBLY_ASSISTANT', item: 'Montageassistent wird benötigt'},
    { id: 'TRANSPORT_COOLING', item: 'Transportkühlung wird benötigt'},
  ];

  qualityMetrics = [
    { id: 'temperature', item: 'Temperatur'},
    { id: 'dispersion', item: 'Maximale Maßabweichung'},
  ];

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private router: Router,
    private offersService: OffersService,
  ) {   }

  ngOnInit() {
    const formControlsQ = this.qualifications.map(control => new FormControl(false));
    const formControlsC = this.requiredAbilities.map(control => new FormControl(false));
    const formControlsQm = this.qualityMetrics.map(control => new FormControl(false));

    this.company_name = new FormControl('', Validators.required);
    this.street = new FormControl('', Validators.required);
    this.nb = new FormControl('', Validators.required);
    this.postal_code = new FormControl('', Validators.required);
    this.city = new FormControl('', Validators.required);
    this.delivery_address = new FormGroup(
      {
        'street': this.street,
        'number': this.nb,
        'postal_code': this.postal_code,
        'city': this.city,
      }
    )
    this.product_id = new FormControl('', Validators.required);
    this.amount = new FormControl('', Validators.required);
    this.delivery_date = new FormControl('');
    this.max_price = new FormControl('');
    this.min_rating = new FormControl('');
    this.required_qualifications = new FormArray(formControlsQ);
    this.quality_measurements = new FormArray(formControlsQm);
    this.required_abilities = new FormArray(formControlsC);

    this.demandRegistrationForm = this.formBuilder.group({
      'company_name': this.company_name,
      'delivery_address': this.delivery_address,
      'product_id': this.product_id,
      'amount': this.amount,
      'delivery_date': this.delivery_date,
      'max_price': this.max_price,
      'min_rating': this.min_rating,
      required_qualifications: new FormArray(formControlsQ),
      quality_measurements: new FormArray(formControlsQm),
      required_abilities: new FormArray(formControlsC),
      })
  }

  onSubmit(demandData){
    const newDemand = new Request(
      '',
      demandData['company_name'],
      new Address(
        demandData['delivery_address']['street'],
        demandData['delivery_address']['number'],
        demandData['delivery_address']['postal_code'],
        demandData['delivery_address']['city'],
      ),
      demandData['product_id'],
      demandData['amount'],
      demandData['delivery_date'],
      demandData['max_price'],
      demandData['min_rating'],
      this.convertQualif(demandData),
      this.convertAbilities(demandData),
      this.convertMeasurements(demandData)
    );
    this.httpClient
      .post<Request>('https://dpnb-mvp.firebaseio.com//offers/requests.json', newDemand)
      .subscribe(
        (val) => {
          console.log("Data submitted: ", newDemand);
          this.offersService.setOrderId(val);
          this.offersService.setOrder(newDemand);
          this.orderId=val["name"];
          console.log(this.orderId)
        },
        error => {
          console.log('Erreur ! : ' + error);
        },
        () =>{
          console.log('Data saved');
        },
    );
    
    if(demandData['quality_measurements'][0]==true && demandData['quality_measurements'][1]==true){
      const metrics = {dispersion: Math.round((Math.random()*2)*100)/100, temperature:  Math.round((18+Math.random()*5)*100)/100 }
    }
    else{
      if(demandData['quality_measurements'][0]==true){
        const metrics = {temperature: Math.round((18+Math.random()*5)*100)/100 }
      }
      if(demandData['quality_measurements'][1]==true){
        const metrics = {dispersion: Math.round((Math.random()*2)*100)/100}
      }
    }
    
    setTimeout(
      () => {
        if(metrics){
              this.httpClient
      .put('https://dpnb-mvp.firebaseio.com//orders/'+this.orderId+'/status.json', metrics)
      .subscribe(
        (val) => {
          console.log("Metrics submitted: ", metrics);
        },
        error => {
          console.log('Erreur ! : ' + error);
        },
        () =>{
          console.log('Metrics saved');
        },
    ); }

        this.router.navigate(['loading']);
        console.log(this.offersService.getOrderId());
        this.demandRegistrationForm.reset();
      }, 1000
    );

  }

  convertQualif(demandData) : string[] {
    let res = [];
    let initQualif = demandData['required_qualifications'] ? demandData['required_qualifications'] : [];
    let i = 0;
    while (i<initQualif.length){
      if (initQualif[i]===true){
        res.push(this.qualifications[i].quali);
      };
      i++;
    }
    return res;
  }

  convertAbilities(demandData) : string[] {
    let res = [];
    let initAbil = demandData['required_abilities'] ? demandData['required_abilities'] : [];
    let i = 0;
    while (i<initAbil.length){
      if (initAbil[i]===true){
        res.push(this.requiredAbilities[i].id);
      };
      i++;
    }
    return res;
  }

  convertMeasurements(demandData) : string[] {
    let res = [];
    let initMeas = demandData['quality_measurements'] ? demandData['quality_measurements'] : [];
    let i = 0;
    while (i<initMeas.length){
      if (initMeas[i]===true){
        res.push(this.qualityMetrics[i].id);
      };
      i++;
    }
    return res;
  }

}