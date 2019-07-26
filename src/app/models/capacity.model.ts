import { Discount } from './discount.model';
import { CapacityMachine } from './capacityMachine.model';

export class Capacity {

  constructor(
    public capacitiesMachine : CapacityMachine[],
    public material_cost: number,
  ) {}


}