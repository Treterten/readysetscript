import * as Phaser from 'phaser';
import Menu from './Menu';

class ActionsMenu extends Menu {
  constructor(x: number, y: number, scene: Phaser.Scene) {
    super(x, y, scene, []);
    this.addMenuItem('Attack');
    this.addMenuItem('Run');
  }

  confirm() {
    console.log(this.menuItems[this.menuItemIndex].text);
    if (this.menuItems[this.menuItemIndex].text === 'Attack') {
      this.scene.events.emit('SelectEnemies');
    } else if (this.menuItems[this.menuItemIndex].text === 'Run') {
      this.scene.events.emit('RunAway');
    }
  }

  // TODO: Confirm
}

export default ActionsMenu;
