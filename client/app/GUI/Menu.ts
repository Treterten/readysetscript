import * as Phaser from 'phaser';
import MenuItem from './MenuItem';

class Menu extends Phaser.GameObjects.Container {
  menuItems: MenuItem[];

  menuItemIndex: number;

  heroes: [];

  selected: boolean;

  constructor(x: number, y: number, scene: Phaser.Scene, heroes: []) {
    super(scene, x, y);

    this.menuItems = [];
    this.menuItemIndex = 0;
    this.heroes = heroes;
    this.x = x;
    this.y = y;
    this.selected = false;
  }

  addMenuItem(unit: string) {
    const menuItem = new MenuItem(0, this.menuItems.length * 20, this.scene, unit);
    this.menuItems.push(menuItem);
    this.add(menuItem);
    return menuItem;
  }

  moveSelectionUp() {
    this.menuItems[this.menuItemIndex].deselect();
    do {
      this.menuItemIndex -= 1;
      if (this.menuItemIndex < 0) {
        this.menuItemIndex = this.menuItems.length - 1;
      }
    } while (!this.menuItems[this.menuItemIndex].active);
    this.menuItems[this.menuItemIndex].select();
  }

  moveSelectionDown() {
    this.menuItems[this.menuItemIndex].deselect();
    do {
      this.menuItemIndex += 1;
      if (this.menuItemIndex >= this.menuItems.length) {
        this.menuItemIndex = 0;
      }
    } while (!this.menuItems[this.menuItemIndex].active);
    this.menuItems[this.menuItemIndex].select();
  }

  select(index: number = 0) {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = index;
    while (!this.menuItems[this.menuItemIndex].active) {
      this.menuItemIndex += 1;
      if (this.menuItemIndex >= this.menuItems.length) {
        this.menuItemIndex = 0;
      }
      if (this.menuItemIndex === index) {
        return;
      }
    }
    this.menuItems[this.menuItemIndex].select();
    this.selected = true;
  }

  deselect() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = 0;
    this.selected = false;
  }

  clear() {
    for (let i = 0; i < this.menuItems.length; i += 1) {
      this.menuItems[i].destroy();
    }
    this.menuItems.length = 0;
    this.menuItemIndex = 0;
  }

  remap(units: any) {
    this.clear();
    for (let i = 0; i < units.length; i += 1) {
      const unit = units[i];
      unit.setMenuItem(this.addMenuItem(unit.type));
    }
    this.menuItemIndex = 0;
  }

  // eslint-disable-next-line class-methods-use-this
  confirm() {
    throw new Error('Method not implemented.');
  }

  // TODO: Confirm
}

export default Menu;
