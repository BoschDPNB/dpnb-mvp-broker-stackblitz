import { Discount } from './discount.model';

export class Capacity {

  constructor(
    public default_price: number,
    public discounts: Discount[],
    public min_price : number,
  ) {}


}
