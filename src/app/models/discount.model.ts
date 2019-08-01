export class Discount {

  constructor(
    public date: Date,
    public enddate: Date,
    public percentage: number,
    public capacity: number,
  ) {}

}