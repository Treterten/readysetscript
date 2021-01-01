import * as Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import WorldScene from './scenes/WorldScene';
import BattleScene from './scenes/BattleScene';
import UIScene from './scenes/UIScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  title: 'Ready Set Script',
  width: 320,
  height: 240,
  pixelArt: true,
  zoom: 2,
  parent: 'game',
  scene: [
    BootScene,
    WorldScene,
    BattleScene,
    UIScene,
  ],
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 0 },
    },
  },
};

const game = new Phaser.Game(config);
export default game;
