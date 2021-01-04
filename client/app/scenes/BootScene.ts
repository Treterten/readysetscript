import * as Phaser from 'phaser';
import * as BrowserFs from 'browserfs';

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    BrowserFs.install(window);
    this.scene.start('WorldScene');
  }

  preload() {
    this.load.image('tiles', './assets/spritesheet.png');
    this.load.image('BattleBack', './assets/alphaField.png');
    this.load.html('chatInput', './assets/chatForm.html');
    this.load.tilemapTiledJSON('map', './assets/test_map_2.json');
    this.load.audio('encounter', './assets/Fite.ogg');
    this.load.spritesheet('player', './assets/character.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('otherPlayer', './assets/character_other.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('miniPlayer', './assets/minPlayer.png', { frameWidth: 8, frameHeight: 8 });
    this.load.spritesheet('nodes', './assets/nodes.png', { frameWidth: 8, frameHeight: 8 });
    this.load.spritesheet('playerBattle', './assets/js_battle.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('bugBattle', './assets/bug_battle.png', { frameWidth: 32, frameHeight: 32 });
  }
}

export default BootScene;
