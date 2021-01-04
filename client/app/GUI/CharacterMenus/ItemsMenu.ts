import * as Phaser from 'phaser';
import Menu from '../Menu';
import Javascript from '../../CharacterInformation/CharacterStats';
import Item from '../../CharacterInformation/Items';

class ItemsMenu extends Menu {
  items: Item[];

  constructor(x: number, y: number, scene: Phaser.Scene) {
    super(x, y, scene, []);
    this.items = Javascript.inventory;
    this.remap(this.items);
  }

  remap(items: Item[]) {
    this.clear();
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      this.addMenuItem(item.name);
    }
    this.addMenuItem('Cancel');
    this.menuItemIndex = 0;
  }

  confirm() {
    if (this.menuItems[this.menuItemIndex].text === 'Cancel') {
      this.scene.events.emit('CancelItems');
    } else {
      this.scene.events.emit('ConfirmItem');
    }
  }
}
export default ItemsMenu;
