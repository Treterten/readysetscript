import Item from './Items';
import potion from '../Items/ItemList';

interface Indexable {
  [key: string] : any

}
class Character {
  maxHp: number;

  hp: number;

  defense: number;

  hackingPoints: number;

  hackingPower: number;

  attack: number;

  speed: number;

  exp: number;

  nextExp: number;

  name: string;

  inventory: Item[];

  constructor(maxHp: number, hp: number, defense: number, hackingPoints: number,
    hackingPower: number, attack: number, speed: number, exp: number, nextExp: number,
    items: Item[]) {
    this.maxHp = maxHp;
    this.hp = hp;
    this.defense = defense;
    this.hackingPoints = hackingPoints;
    this.hackingPower = hackingPower;
    this.attack = attack;
    this.speed = speed;
    this.exp = exp;
    this.nextExp = nextExp;
    this.inventory = items;
  }
}

const Javascript = new Character(100, 100, 1, 5, 10, 20, 10, 0, 5, [
  potion, potion, potion, potion, potion, potion,
]);

export default Javascript as Indexable;
