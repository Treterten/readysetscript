class Item {
  description: string;

  stat: string;

  amount: number;

  name: string;

  constructor(description: string, stat: string, amount: number, name: string) {
    this.description = description;
    this.stat = stat;
    this.amount = amount;
    this.name = name;
  }
}
export default Item;
