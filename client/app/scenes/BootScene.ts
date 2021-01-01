import * as Phaser from 'phaser';

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    this.scene.start('WorldScene');
  }

  preload() {
    this.load.image('tiles', './assets/spritesheet.png');
    this.load.tilemapTiledJSON('map', './assets/test_map_2.json');
    this.load.spritesheet('player', './assets/character.png', { frameWidth: 16, frameHeight: 16 });

    this.load.spritesheet('playerBattle', './assets/js_battle.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('bugBattle', './assets/bug_battle.png', { frameWidth: 32, frameHeight: 32 });
  }
}

export default BootScene;
