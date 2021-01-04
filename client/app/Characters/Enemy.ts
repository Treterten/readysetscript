import * as Phaser from 'phaser';
import Unit from './Unit';

class Enemy extends Unit {
  constructor(scene: Phaser.Scene, x: number, y: number, frame: number,
    type: string, texture: string, hp: number, maxHp: number, damage: number) {
    super(scene, x, y, texture, frame, type, hp, maxHp, damage);
  }
}

export default Enemy;
