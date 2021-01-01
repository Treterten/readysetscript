import * as Phaser from 'phaser';

class MenuItem extends Phaser.GameObjects.Text {
  constructor(x: number, y: number, scene: Phaser.Scene, text: string) {
    super(scene, x, y, text, { color: '#ffffff', align: 'left', fontSize: '15' });
  }

  select() {
    this.setColor('f8ff38');
  }

  deselect() {
    this.setColor('#ffffff');
  }

  unitKilled() {
    this.active = false;
    this.visible = false;
  }
}

export default MenuItem;
