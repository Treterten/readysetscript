import * as Phaser from 'phaser';
import Menu from './Menu';

class EnemiesMenu extends Menu {
  constructor(x: number, y: number, scene: Phaser.Scene) {
    super(x, y, scene, []);
  }

  // TODO: confirm
  confirm() {
    this.scene.events.emit('Enemy', this.menuItemIndex);
  }
}

export default EnemiesMenu;
