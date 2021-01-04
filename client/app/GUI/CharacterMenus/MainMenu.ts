import * as Phaser from 'phaser';
import Menu from '../Menu';

class MainMenu extends Menu {
  constructor(x: number, y: number, scene: Phaser.Scene) {
    super(x, y, scene, []);
    this.addMenuItem('Items');
    this.addMenuItem('Exit');
    this.selected = true;
    this.menuItems[0].select();
  }

  confirm() {
    console.log(this.menuItems[this.menuItemIndex].text);
    if (this.menuItems[this.menuItemIndex].text === 'Items') {
      this.scene.events.emit('OpenItemsMenu');
    } else if (this.menuItems[this.menuItemIndex].text === 'Exit') {
      this.scene.events.emit('ExitMenu');
    }
  }
}

export default MainMenu;
