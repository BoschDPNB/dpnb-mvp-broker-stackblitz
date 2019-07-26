import { Discount } from './discount.model';

export class CapacityMachine {

  constructor(
    public default_price: number,
    public discounts: Discount[],
    public min_price : number,
    //public material_cost: number,
  ) {}


}
