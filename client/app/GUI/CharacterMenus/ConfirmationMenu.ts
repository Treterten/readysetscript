import * as Phaser from 'phaser';
import Menu from '../Menu';

class ConfirmationMenu extends Menu {
  constructor(x: number, y: number, scene: Phaser.Scene) {
    super(x, y, scene, []);
    this.addMenuItem('Yes');
    this.addMenuItem('No');
  }

  confirm() {
    if (this.menuItems[this.menuItemIndex].text === 'No') {
      this.scene.events.emit('CancelConfirm');
    } else {
      this.scene.events.emit('UseItem');
    }
  }
}
export default ConfirmationMenu;
