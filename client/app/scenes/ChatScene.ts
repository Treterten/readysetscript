import * as Phaser from 'phaser';
import menuInformation from '../SceneControl/menuControl';

class ChatScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ChatScene' });
  }

  create() {
    const element = this.add.dom(160, 225).createFromCache('chatInput');
    console.log(element);
    element.addListener('submit');
    const self = this;
    this.game.input.keyboard.enabled = false;
    element.on('submit', function (e: any) {
      e.preventDefault();
      const text = this.getChildByName('text').value;
      menuInformation.menuOn = false;
      self.game.input.keyboard.enabled = true;
      self.events.emit('SendChatMessage', text);
    });
  }
}
export default ChatScene;
