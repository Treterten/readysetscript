import * as Phaser from 'phaser';

class ChatMessage extends Phaser.GameObjects.Container {
  text: Phaser.GameObjects.Text;

  hideEvent: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, events: any, x: number, y: number) {
    super(scene, x, y);
    const graphics = this.scene.add.graphics();
    this.add(graphics);
    // graphics.lineStyle(1, 0xffffff, 0.8);
    // graphics.fillStyle(0x031f4c, 0.3);
    // graphics.strokeRect(50, 50, 180, 30);
    // graphics.fillRect(50, 50, 180, 30);
    this.text = new Phaser.GameObjects.Text(scene, 50, 50, '', {
      color: '#ffffff', align: 'center', fontSize: '13', wordWrap: { width: 160, useAdvancedWrap: true },
    });
    this.add(this.text);
    events.on('ChatMessage', this.showMessage, this);
    this.visible = false;
  }

  changePosition(x: number, y: number) {
    this.text.setOrigin(x, y);
    // this.text.x = x;
    // this.text.y = y;
    console.log('Changing Position... to:', x, y);
  }

  showMessage(text: string = 'You need to pass the text in') {
    console.log(text);
    this.text.setText(text);
    this.visible = true;
    if (this.hideEvent) {
      this.hideEvent.remove(false);
    }
    this.hideEvent = this.scene.time.addEvent({
      delay: 2000, callback: this.hideMessage, callbackScope: this,
    });
  }

  hideMessage() {
    this.hideEvent = null;
    this.visible = false;
  }
}

export default ChatMessage;
