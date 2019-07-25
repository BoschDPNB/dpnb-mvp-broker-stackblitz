import { Address } from './address.model';

export class Request {

  constructor(
    public id: string,
    public company_name: string,
    public delivery_address: Address,
    public product_id: string,
    public amount: number,
    public delivery_date: Date,
    public max_price: number,
    public min_rating: number,
    public required_qualifications: string[],
    public required_abilities: string[],
    public quality_measurements: string[]
  ) {}

}