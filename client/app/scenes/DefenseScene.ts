import * as Phaser from 'phaser';

class DefenseScene extends Phaser.Scene {
  area: Phaser.GameObjects.Graphics;

  miniPlayer: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  nodes: [[Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, boolean]];

  activeNodes: number;

  goalNodes: number;

  constructor() {
    super({ key: 'DefenseScene' });
  }

  create() {
    this.area = this.add.graphics();
    this.area.lineStyle(2, 0xffffff);
    this.area.fillStyle(0x000000, 1);
    this.area.strokeRect(2, 135, 316, 100);
    this.area.fillRect(2, 135, 316, 100);

    this.miniPlayer = this.physics.add.sprite(160, 185, 'miniPlayer');
    this.physics.world.setBounds(2, 135, 316, 100);
    this.miniPlayer.setCollideWorldBounds(true);

    const r = Math.floor(Math.random() * 7 + 2);
    this.goalNodes = r;
    this.activeNodes = 0;
    for (let i = 0; i < r; i += 1) {
      const x = Math.floor(Math.random() * 310 + 5);
      const y = Math.floor(Math.random() * 90 + 145);
      const node = this.physics.add.sprite(x, y, 'nodes', 1);
      node.body.moves = false;
      this.physics.add.collider(this.miniPlayer, node, () => {
        this.activateNode(i);
      });
      node.setCollideWorldBounds(true);
      if (!this.nodes) {
        this.nodes = [[node, false]];
      } else {
        this.nodes[i] = [node, false];
      }
    }

    this.cursors = this.input.keyboard.createCursorKeys();

    this.challenge();
  }
  // [node, index]

  activateNode(index: number) {
    console.log('Activating Node...');
    if (this.nodes[index][1] === false) {
      this.nodes[index][0].setFrame(2);
      this.activeNodes += 1;
      this.nodes[index][1] = true;
    }
  }

  update() {
    // Horizontal movement
    this.miniPlayer.body.setVelocity(0);
    if (this.cursors.left.isDown) {
      this.miniPlayer.body.setVelocityX(-80);
    } else if (this.cursors.right.isDown) {
      this.miniPlayer.body.setVelocityX(80);
    }
    // Vertical movement
    if (this.cursors.up.isDown) {
      this.miniPlayer.body.setVelocityY(-80);
    } else if (this.cursors.down.isDown) {
      this.miniPlayer.body.setVelocityY(80);
    }
  }

  challenge() {
    console.log('Here goes the timer...');
    this.time.addEvent({ delay: 5000, callback: this.endChallenge, callbackScope: this });
  }

  endChallenge() {
    console.log('Ended the Challenge');
    this.area.destroy();
    if (this.activeNodes === this.goalNodes) {
      this.activeNodes = 0;
      this.goalNodes = 0;
      console.log('Success!');
      this.events.emit('ChallengeFinished', true);
    } else {
      this.activeNodes = 0;
      this.goalNodes = 0;
      console.log('Failure');
      this.events.emit('ChallengeFinished', false);
    }
  }
}
export default DefenseScene;
