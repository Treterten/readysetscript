import * as Phaser from 'phaser';
import Enemy from '../Characters/Enemy';
import PlayerCharacter from '../Characters/PlayerCharacter';

class BattleScene extends Phaser.Scene {
  heroes: PlayerCharacter[];

  enemies: Enemy[];

  units: PlayerCharacter[];

  index: number;

  constructor() {
    super({ key: 'BattleScene' });
  }

  create() {
    this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');
    this.startBattle();
    this.sys.events.on('wake', this.startBattle, this);
  }

  nextTurn() {
    if (this.checkEndBattle()) {
      this.endBattle();
      return;
    }
    do {
      this.index += 1;
      if (this.index >= this.units.length) {
        this.index = 0;
      }
    } while (!this.units[this.index].living);

    if (this.units[this.index]) {
      if (this.units[this.index] instanceof PlayerCharacter) {
        this.events.emit('PlayerSelect', this.index);
      } else {
        const r = Math.floor(Math.random() * this.heroes.length);
        this.units[this.index].attack(this.heroes[r]);
        this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
      }
    }
  }

  checkEndBattle() {
    let victory: boolean = true;
    for (let i = 0; i < this.enemies.length; i += 1) {
      if (this.enemies[i].living) {
        victory = false;
      }
    }
    let gameOver: boolean = true;
    for (let i = 0; i < this.heroes.length; i += 1) {
      if (this.heroes[i].living) {
        gameOver = false;
      }
    }
    return victory || gameOver;
  }

  recievePlayerSelection(action: string, target: number) {
    if (action === 'attack') {
      this.units[this.index].attack(this.enemies[target]);
    } else if (action === 'run') {
      this.exitBattle();
    }
    this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
  }

  exitBattle() {
    this.scene.sleep('UIScene');
    this.scene.switch('WorldScene');
  }

  endBattle() {
    this.heroes.length = 0;
    this.enemies.length = 0;
    for (let i = 0; i < this.units.length; i += 1) {
      this.units[i].destroy();
    }
    this.units.length = 0;
    this.scene.sleep('UIScene');
    this.scene.switch('WorldScene');
  }

  startBattle() {
    const warrior = new PlayerCharacter(this, 250, 50, 'playerBattle', 1, 'Warrior', 100, 20);
    this.add.existing(warrior);

    const bug = new Enemy(this, 50, 50, 1, 'Bug', 'bugBattle', 50, 3);
    this.add.existing(bug);

    this.heroes = [warrior];
    this.enemies = [bug];
    this.units = this.heroes.concat(this.enemies);
    this.index = -1;
    this.scene.run('UIScene');
  }
}

export default BattleScene;
