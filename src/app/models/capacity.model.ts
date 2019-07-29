import { Discount } from './discount.model';
import { CapacityMachine } from './capacityMachine.model';

export class Capacity {

  constructor(
    public capacitiesMachine : {
      SMALL_SIMPLEX:CapacityMachine,
      SMALL_DUPLEX: CapacityMachine,
      SMALL_SUPPORT: CapacityMachine,
      LARGE_SIMPLEX: CapacityMachine,
      LARGE_DUPLEX: CapacityMachine,
      LARGE_SUPPORT: CapacityMachine,
      PKW_CADDY: CapacityMachine,
      _7T_FAHRZEUG: CapacityMachine,
      _40T_FAHRZEUG: CapacityMachine,
    },
    public material_cost: number,
  ) {}


}