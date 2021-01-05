import * as Phaser from 'phaser';
import menuInformation from '../SceneControl/menuControl';
import Javascript from '../CharacterInformation/CharacterStats';

class NameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'NameScene' });
  }

  create() {
    this.sound.play('startup', { loop: true });
    const element = this.add.dom(160, 120).createFromCache('chatInput');
    this.add.text(0, 0, 'Ready. Set. Script!', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#000000' });
    this.add.text(65, 50, 'Enter your username below!', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
    this.add.text(120, 150, 'Controls', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
    this.add.text(35, 190, 'Move: Arrow Keys | Chat: C | Menu: Z | Confirm: Space', { fontFamily: '10px Georgia, "Goudy Bookletter 1911", Times, serif' });
    this.add.image(0, 0, 'BattleBack').setOrigin(0).setDepth(-2);
    this.cameras.main.fadeFrom(7000, 255, 255, 255);
    console.log(element);
    element.addListener('submit');
    const self = this;
    this.game.input.keyboard.enabled = false;
    element.on('submit', function (e: any) {
      e.preventDefault();
      const text = this.getChildByName('text').value;
      menuInformation.menuOn = false;
      self.game.input.keyboard.enabled = true;
      self.startWorld(text);
    });
  }

  startWorld(text: string) {
    Javascript.name = text;
    this.sound.stopByKey('startup');
    this.scene.start('WorldScene');
  }
}
export default NameScene;
