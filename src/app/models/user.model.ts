import { Address } from './address.model';
import { Machines } from './machines.model';
import { Trucks } from './trucks.model';

export class User {

  constructor(
    public id: string,
    public username: string,
    public password: string,
    public company_name: string,
    public company_address: Address,
    public machines: Machines,
    public trucks: Trucks,
    public qualifications: string[],
    public role: string,
    public abilities: string[]
  ) {}

  updateUser (user : User) {
    this.abilities = user.abilities;
    this.company_address = user.company_address;
    this.company_name = user.company_name;
    this.machines = user.machines;
    this.trucks = user.trucks;
    this.password = user.password;
    this.qualifications = user.qualifications;
    this.role = user.role;
    this.username = user.username;
  }

}

