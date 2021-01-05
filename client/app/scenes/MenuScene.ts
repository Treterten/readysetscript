import * as Phaser from 'phaser';
import MainMenu from '../GUI/CharacterMenus/MainMenu';
import Javascript from '../CharacterInformation/CharacterStats';
import Menu from '../GUI/Menu';
import ItemsMenu from '../GUI/CharacterMenus/ItemsMenu';
import ConfirmationMenu from '../GUI/CharacterMenus/ConfirmationMenu';
import WorldScene from './WorldScene';
import menuInformation from '../SceneControl/menuControl';

class MenuScene extends Phaser.Scene {
  graphics: any;

  mainMenu:MainMenu;

  itemsMenu: ItemsMenu;

  confirmationMenu: ConfirmationMenu;

  mainContainer: Phaser.GameObjects.Container;

  itemsContainer: Phaser.GameObjects.Container;

  confirmationContainer: Phaser.GameObjects.Container;

  charSprite: Phaser.GameObjects.Sprite;

  hpText: Phaser.GameObjects.Text;

  hackPointsText: Phaser.GameObjects.Text;

  currentMenu: Menu;

  itemsGraphics: Phaser.GameObjects.Graphics;

  confirmationGraphics: Phaser.GameObjects.Graphics;

  world: WorldScene;

  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(2, 0xffffff);
    this.graphics.fillStyle(0x000000, 1);
    this.graphics.strokeRect(5, 5, 37, 45);
    this.graphics.fillRect(5, 5, 37, 45);
    this.graphics.strokeRect(210, 5, 100, 100);
    this.graphics.fillRect(210, 5, 100, 100);
    this.graphics.fillStyle(0xffffff, 1);
    this.graphics.fillRect(240, 10, 40, 40);

    this.charSprite = this.add.sprite(260, 28, 'playerBattle');

    this.graphics.fillStyle(0xff0000, 1);
    this.graphics.fillRect(220, 60, 80, 10);
    this.graphics.fillStyle(0x10eb4b, 1);
    if (Javascript.hp === Javascript.maxHp) {
      this.graphics.fillRect(220, 60, 80, 10);
    } else {
      const width = 80 - Math.round(
        (Javascript.maxHp - Javascript.hp)
        / Math.round(Javascript.maxHp / 80),
      );
      if (width > 0) {
        this.graphics.fillRect(220, 60, width, 10);
      } else {
        this.graphics.fillRect(220, 60, 0, 10);
      }
    }
    this.hpText = this.add.text(221, 60, `HP: ${Javascript.hp} / ${Javascript.maxHp}`, { fontSize: '10px' });

    this.graphics.fillStyle(0x0000FF, 1);
    this.graphics.fillRect(220, 80, 80, 10);
    this.hpText = this.add.text(222, 80, `HaP: ${Javascript.hackingPoints} / 20`, { fontSize: '9px' });

    this.confirmationGraphics = this.add.graphics();
    this.confirmationGraphics.lineStyle(2, 0xffffff);
    this.confirmationGraphics.fillStyle(0x000000, 1);
    this.confirmationGraphics.strokeRect(115, 5, 40, 45);
    this.confirmationGraphics.fillRect(115, 5, 40, 45);
    this.confirmationGraphics.alpha = 0;

    this.mainMenu = new MainMenu(11, 8, this);
    this.itemsMenu = new ItemsMenu(55, 8, this);
    this.confirmationMenu = new ConfirmationMenu(119, 8, this);

    this.itemsGraphics = this.add.graphics();
    this.itemsGraphics.lineStyle(2, 0xffffff);
    this.itemsGraphics.fillStyle(0x000000, 1);
    this.itemsGraphics.strokeRect(50, 5, 60, 30 * (this.itemsMenu.items.length + 1));
    this.itemsGraphics.fillRect(50, 5, 60, 30 * (this.itemsMenu.items.length + 1));
    this.itemsGraphics.alpha = 0;

    this.mainContainer = this.add.container();
    this.itemsContainer = this.add.container();
    this.confirmationContainer = this.add.container();
    this.mainContainer.add(this.mainMenu);
    this.itemsContainer.add(this.itemsMenu);
    this.confirmationContainer.add(this.confirmationMenu);
    this.itemsContainer.alpha = 0;
    this.confirmationContainer.alpha = 0;
    this.input.keyboard.on('keydown', this.onKeyInput, this);
    this.currentMenu = this.mainMenu;

    this.events.on('OpenItemsMenu', this.openItems, this);
    this.events.on('ExitMenu', this.exit, this);
    this.events.on('CancelItems', this.closeItems, this);
    this.events.on('ConfirmItem', this.openConfirm, this);
    this.events.on('CancelConfirm', this.closeConfirm, this);
    this.events.on('UseItem', this.useItem, this);
  }

  onKeyInput(event: KeyboardEvent) {
    if (this.currentMenu && this.currentMenu.selected) {
      if (event.code === 'ArrowUp') {
        this.currentMenu.moveSelectionUp();
        this.sound.play('select');
      } else if (event.code === 'ArrowDown') {
        this.currentMenu.moveSelectionDown();
        this.sound.play('select');
      } else if (event.code === 'ArrowRight' || event.code === 'Shift') {
        // TODO: Implement
      } else if (event.code === 'Space' || event.code === 'ArrowLeft') {
        this.currentMenu.confirm();
        this.sound.play('confirm');
      }
    }
  }

  openItems() {
    this.currentMenu.deselect();
    this.currentMenu = this.itemsMenu;
    this.currentMenu.select();
    this.currentMenu.menuItems[0].select();
    this.itemsGraphics.alpha = 1;
    this.itemsContainer.alpha = 1;
  }

  closeItems() {
    this.currentMenu.deselect();
    this.currentMenu = this.mainMenu;
    this.currentMenu.select();
    this.itemsGraphics.alpha = 0;
    this.itemsContainer.alpha = 0;
  }

  openConfirm() {
    this.currentMenu = this.confirmationMenu;
    this.currentMenu.select();
    this.confirmationGraphics.alpha = 1;
    this.confirmationContainer.alpha = 1;
  }

  exit() {
    menuInformation.menuOn = false;
    this.scene.stop('MenuScene');
  }

  closeConfirm() {
    this.currentMenu.deselect();
    this.currentMenu = this.itemsMenu;
    this.currentMenu.select();
    this.confirmationGraphics.alpha = 0;
    this.confirmationContainer.alpha = 0;
  }

  useItem() {
    console.log(Javascript.inventory);
    console.log('Using Item...');
    const item = Javascript.inventory.splice(this.itemsMenu.menuItemIndex, 1)[0];
    Javascript[item.stat] += item.amount;
    if (Javascript.hp > Javascript.maxHp) {
      Javascript.hp = Javascript.maxHp;
    }
    this.events.off('UseItem');
    this.exit();
  }
}

export default MenuScene;
