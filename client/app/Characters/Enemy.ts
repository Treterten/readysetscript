import * as Phaser from 'phaser';
import Unit from './Unit';

class Enemy extends Unit {
  constructor(scene: Phaser.Scene, x: number, y: number, frame: number,
    type: string, texture: string, hp: number, damage: number) {
    super(scene, x, y, texture, frame, type, hp, damage);
  }
}

export default Enemy;
