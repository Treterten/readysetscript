import * as Phaser from 'phaser';

class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create() {
    this.sound.play('gameOver', { loop: true });
    this.add.text(65, 50, 'The bug caused a fatal error :( \n (You Died)', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
    this.add.text(35, 190, 'Refresh to start again.', { fontFamily: '10px Georgia, "Goudy Bookletter 1911", Times, serif' });
  }
}
export default GameOverScene;
