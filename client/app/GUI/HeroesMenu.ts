import * as Phaser from 'phaser';
import Menu from './Menu';

class HeroesMenu extends Menu {
  // eslint-disable-next-line no-useless-constructor
  constructor(x: number, y: number, scene: Phaser.Scene) {
    super(x, y, scene, []);
  }
}

export default HeroesMenu;
