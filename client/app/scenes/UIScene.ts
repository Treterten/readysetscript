import * as Phaser from 'phaser';
import ActionsMenu from '../GUI/ActionsMenu';
import EnemiesMenu from '../GUI/EnemiesMenu';
import HeroesMenu from '../GUI/HeroesMenu';
import Menu from '../GUI/Menu';
import Message from '../GUI/Message';

class UIScene extends Phaser.Scene {
  graphics: any;

  menus: Phaser.GameObjects.Container;

  heroesMenu: HeroesMenu;

  actionsMenu: ActionsMenu;

  enemiesMenu: EnemiesMenu;

  currentMenu: Menu;

  battleScene: any;

  defenseScene: any;

  message: Message;

  constructor() {
    super({ key: 'UIScene' });
  }

  create() {
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(2, 0xffffff);
    this.graphics.fillStyle(0x000000, 1);
    this.graphics.strokeRect(2, 135, 90, 100);
    this.graphics.fillRect(2, 135, 90, 100);
    this.graphics.strokeRect(95, 135, 90, 100);
    this.graphics.fillRect(95, 135, 90, 100);
    this.graphics.strokeRect(188, 135, 130, 100);
    this.graphics.fillRect(188, 135, 130, 100);
    this.menus = this.add.container();

    this.heroesMenu = new HeroesMenu(195, 153, this);
    this.actionsMenu = new ActionsMenu(100, 153, this);
    this.enemiesMenu = new EnemiesMenu(8, 153, this);

    this.currentMenu = this.actionsMenu;

    this.menus.add(this.heroesMenu);
    this.menus.add(this.actionsMenu);
    this.menus.add(this.enemiesMenu);

    this.battleScene = this.scene.get('BattleScene');
    this.defenseScene = this.scene.get('DefenseScene');

    this.input.keyboard.on('keydown', this.onKeyInput, this);
    this.battleScene.events.on('PlayerSelect', this.onPlayerSelect, this);
    this.battleScene.events.on('EnemyAttack', this.startChallenge, this);
    this.defenseScene.events.on('ChallengeFinished', this.endChallenge, this);
    this.events.on('SelectEnemies', this.onSelectEnemies, this);
    this.events.on('Enemy', this.onEnemy, this);
    this.events.on('RunAway', this.onRun, this);
    this.sys.events.on('wake', this.createMenu, this);
    this.message = new Message(this, this.battleScene.events);
    this.add.existing(this.message);
    this.createMenu();
  }

  remapHeroes() {
    const { heroes } = this.battleScene;
    this.heroesMenu.remap(heroes);
  }

  remapEnemies() {
    const { enemies } = this.battleScene;
    this.enemiesMenu.remap(enemies);
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
      } else if (event.code === 'Space') {
        this.currentMenu.confirm();
        this.sound.play('confirm');
      }
    }
  }

  onPlayerSelect(id: number) {
    this.heroesMenu.select(id);
    this.actionsMenu.select(0);
    this.currentMenu = this.actionsMenu;
  }

  onSelectEnemies() {
    this.currentMenu = this.enemiesMenu;
    this.enemiesMenu.select(0);
  }

  onEnemy(index: number) {
    this.heroesMenu.deselect();
    this.actionsMenu.deselect();
    this.enemiesMenu.deselect();
    this.currentMenu = null;
    this.battleScene.recievePlayerSelection('attack', index);
  }

  onRun() {
    this.heroesMenu.deselect();
    this.actionsMenu.deselect();
    this.enemiesMenu.deselect();
    this.currentMenu = null;
    this.battleScene.recievePlayerSelection('run', 0);
  }

  createMenu() {
    this.remapHeroes();
    this.remapEnemies();
    this.battleScene.nextTurn();
  }

  startChallenge() {
    this.scene.run('DefenseScene');
  }

  endChallenge(challengeStatus: boolean) {
    this.scene.stop('DefenseScene');
    this.battleScene.enemyAttack(challengeStatus);
  }
}

export default UIScene;
