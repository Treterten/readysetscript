import * as Phaser from 'phaser';
import MenuItem from '../GUI/MenuItem';

class Unit extends Phaser.GameObjects.Sprite {
  hp: number;

  maxHp: number;

  damage: number;

  menuItem: MenuItem;

  living: boolean;

  constructor(scene: Phaser.Scene,
    x: number, y: number, texture: string, frame: number,
    type: string, hp: number, maxHp: number, damage: number) {
    super(scene, x, y, texture, frame);
    this.type = type;
    this.hp = hp;
    this.maxHp = maxHp;
    this.damage = damage;
    this.living = true;
    this.menuItem = null;
  }

  setMenuItem(item: MenuItem) {
    this.menuItem = item;
  }

  attack(target: Unit) {
    target.takeDamage(this.damage);
    this.scene.events.emit('Message', `${this.type} attacks ${target.type} for ${this.damage} damage`);
  }

  weakAttack(target: Unit) {
    target.takeDamage(Math.floor(this.damage / 2));
    this.scene.events.emit('Message', `${this.type} attacks ${target.type} for ${this.damage / 2} damage`);
  }

  takeDamage(damage: number) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.hp = 0;
      this.menuItem.unitKilled();
      this.living = false;
      this.menuItem = null;
    }
  }
}

export default Unit;
