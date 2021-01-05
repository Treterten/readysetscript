import * as Phaser from 'phaser';
import Enemy from '../Characters/Enemy';
import PlayerCharacter from '../Characters/PlayerCharacter';
import Javascript from '../CharacterInformation/CharacterStats';

class BattleScene extends Phaser.Scene {
  heroes: PlayerCharacter[];

  enemies: Enemy[];

  units: PlayerCharacter[];

  index: number;

  health: Phaser.GameObjects.Graphics;

  healthLeft: Phaser.GameObjects.Graphics;

  graphicStat: {
    [key: string] : Phaser.GameObjects.Rectangle[]
  };

  constructor() {
    super({ key: 'BattleScene' });
    this.graphicStat = {};
  }

  create() {
    this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');
    this.add.image(0, 0, 'BattleBack').setOrigin(0).setDepth(-2);
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
        this.events.emit('Message', 'Activate the nodes!');
        this.events.emit('EnemyAttack');
        // const r = Math.floor(Math.random() * this.heroes.length);
        // this.units[this.index].attack(this.heroes[0]);
        // this.updateHp(r);
        // this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
      }
    }
  }

  enemyAttack(challengeSuccess: boolean) {
    const r = Math.floor(Math.random() * this.heroes.length);
    console.log('ChallengeStatus: ', challengeSuccess);
    this.cameras.main.shake(100);
    if (challengeSuccess) {
      this.units[this.index].weakAttack(this.heroes[r]);
    } else {
      this.units[this.index].attack(this.heroes[r]);
    }
    this.updateHp(r);
    this.time.addEvent({ delay: 1000, callback: this.nextTurn, callbackScope: this });
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
      this.updateHp(this.heroes.length + target);
      this.time.addEvent({ delay: 1000, callback: this.nextTurn, callbackScope: this });
    } else if (action === 'run') {
      const attempt = Math.floor(Math.random() * 2);
      if (attempt === 1) {
        this.endBattle();
      } else {
        this.events.emit('Message', 'Couldn\'t get away!');
        this.time.addEvent({ delay: 1000, callback: this.nextTurn, callbackScope: this });
      }
    }
  }

  updateHp(index: number) {
    console.log('Attempting an update', this.units[index].hp);
    if (this.units[index].maxHp !== this.units[index].hp) {
      console.log('Resizing');
      this.graphicStat[this.units[index].type][0].width = 25 - Math.round(
        (this.units[index].maxHp - this.units[index].hp)
        / Math.round(this.units[index].maxHp / 25),
      );
    }
  }

  exitBattle() {
    Javascript.hp = this.heroes[0].hp;
    this.scene.sleep('UIScene');
    this.scene.switch('WorldScene');
  }

  endBattle() {
    // eslint-disable-next-line global-require
    const hpLeft = this.heroes[0].hp;
    Javascript.hp = this.heroes[0].hp;
    this.heroes.length = 0;
    this.enemies.length = 0;
    this.cameras.main.fadeOut(300, 255, 255, 255);
    for (let i = 0; i < this.units.length; i += 1) {
      for (let j = 0; j < 2; j += 1) {
        this.graphicStat[this.units[i].type][j].destroy();
      }
      this.units[i].destroy();
    }

    this.units.length = 0;
    this.sound.stopByKey('encounter');
    if (hpLeft <= 0) {
      setTimeout(() => {
        this.scene.sleep('UIScene');
        this.scene.switch('GameOverScene');
      }, 500);
    } else {
      setTimeout(() => {
        this.scene.sleep('UIScene');
        this.scene.switch('WorldScene');
      }, 500);
    }
  }

  startBattle() {
    console.log(Javascript.hp);
    this.cameras.main.fadeFrom(3000, 255, 255, 255);
    this.sound.play('encounter', { loop: true });
    const warrior = new PlayerCharacter(this, 250, 80, 'playerBattle', 1, 'JavaScript', Javascript.hp, Javascript.maxHp, Javascript.attack);
    this.add.existing(warrior);

    const bug = new Enemy(this, 50, 80, 1, 'Bug', 'bugBattle', 50, 50, 12);
    this.add.existing(bug);

    this.heroes = [warrior];
    this.enemies = [bug];
    this.units = this.heroes.concat(this.enemies);
    this.index = -1;

    for (let i = 0; i < this.units.length; i += 1) {
      const hpBar = this.add.rectangle(this.units[i].x, 55, 25, 5, 0xFF0000);
      hpBar.depth = -1;
      const hpLeft = this.add.rectangle(this.units[i].x, 55, 25, 5, 0x10eb4b);
      if (this.units[i] instanceof PlayerCharacter) {
        const hackPoints = this.add.rectangle(this.units[i].x, 60, 25, 5, 0x172be3);
        this.graphicStat[this.units[i].type] = [hpLeft, hpBar, hackPoints];
      } else {
        this.graphicStat[this.units[i].type] = [hpLeft, hpBar];
      }
      // new Phaser.GameObjects.Rectangle(
      //   this, this.units[i].x - 12, 25, 25, 5, 0x10eb4b,
      // );

      this.updateHp(i);
    }

    // this.health = this.add.graphics();
    // this.health.lineStyle(1, 0xffffff);
    // this.health.fillStyle(0x53F303, 1);
    // this.health.fillRect(237, 25, 25, 5);
    // this.healthLeft = this.add.graphics();
    // this.healthLeft.lineStyle(1, 0xffffff);
    // this.healthLeft.fillStyle(0xFF0000, 1);
    // this.healthLeft.fillRect(237, 25, 25, 5);
    // this.healthLeft.depth = -1;

    this.scene.run('UIScene');
  }
}

export default BattleScene;
