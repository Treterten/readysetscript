import * as Phaser from 'phaser';
import Unit from './Unit';

class PlayerCharacter extends Unit {
  // eslint-disable-next-line no-useless-constructor
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string,
    frame: number,
    type: string, hp: number, maxHp: number, damage: number) {
    super(scene, x, y, texture, frame, type, hp, maxHp, damage);
  }
}

export default PlayerCharacter;
