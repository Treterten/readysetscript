/* eslint-disable no-param-reassign */
import * as Phaser from 'phaser';
import menuInformation from '../SceneControl/menuControl';
import ChatScene from './ChatScene';
import ChatMessage from '../GUI/ChatMessage';
import Javascript from '../CharacterInformation/CharacterStats';

interface playerInfoType {
   x?: number,
   y?: number,
  playerId?: number,
  frame?: any,
  message?: ChatMessage,
  name?: string,
}

class WorldScene extends Phaser.Scene {
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  spawns: any;

  menuOn: boolean;

  socket: any;

  map: Phaser.Tilemaps.Tilemap;

  trees: Phaser.Tilemaps.TilemapLayer;

  otherPlayers: Phaser.Physics.Arcade.Group;

  oldPosition: { x: number; y: number; frame: number; };

  chatScene: any;

  container: Phaser.GameObjects.Container;

  playerName: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'WorldScene' });
    this.menuOn = false;
  }

  create() {
    // eslint-disable-next-line no-undef
    this.socket = io();
    this.chatScene = ChatScene;
    this.otherPlayers = this.physics.add.group();
    this.socket.on('currentPlayer', (players: any) => {
      console.log('Got a Player!', players);
      Object.keys(players).forEach((id: any) => {
        // eslint-disable-next-line no-restricted-globals
        console.log(this.socket.id, players[id]);
        if (players[id].playerId === this.socket.id) {
          console.log('Going to add a player...');
          this.addPlayer(players[id]);
        } else {
          this.addOtherPlayers(players[id]);
        }
      });
    });

    this.socket.on('newPlayer', (playerInfo: playerInfoType) => {
      setTimeout(() => {
        this.addOtherPlayers(playerInfo);
      }, 500);
    });

    this.socket.on('disconnect', (playerId: string) => {
      this.otherPlayers.getChildren().forEach((otherPlayer:any) => {
        if (playerId === otherPlayer.playerId) {
          otherPlayer.destroy();
        }
      });
    });

    this.socket.on('playerMoved', (playerInfo: playerInfoType) => {
      this.otherPlayers.getChildren().forEach((otherPlayer: any) => {
        console.log(playerInfo.playerId, otherPlayer.playerId);
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.setFrame(playerInfo.frame);
          console.log(playerInfo.frame);
          // otherPlayer.setPosition(playerInfo.x, playerInfo.y);
          otherPlayer.container.setPosition(playerInfo.x, playerInfo.y);
          // If they're dispalying a message show that as well,
          // but always set the message cords to be right above
        }
      });
    });

    this.socket.on('setPlayerMessage', (playerInfo: playerInfoType, text: string) => {
      // Show the message for two seconds, and make sure that it's visible
      if (this.socket.id === playerInfo.playerId) {
        console.log('Showing your text');
        const style = { font: '15px Arial', fill: '#ffffff' };
        const playerText = this.add.text(-10, -20, text, style);
        // this.player.message.showMessage(text);
        // this.player.addChild(playerText);
        this.container.add(playerText);
        setTimeout(() => {
          this.container.remove(playerText);
        }, 2000);
      } else {
        this.otherPlayers.getChildren().forEach((otherPlayer: any) => {
          if (playerInfo.playerId === otherPlayer.playerId) {
            console.log('Showing someone else\'s text');
            const style = { font: '15px Arial', fill: '#ffffff' };
            const otherPlayerText = this.add.text(-10, -20, text, style);
            otherPlayer.container.add(otherPlayerText);
            setTimeout(() => {
              otherPlayer.container.remove(otherPlayerText);
            }, 2000);
          }
        });
      }
    });

    this.chatScene = this.scene.get('ChatScene');

    this.map = this.make.tilemap({ key: 'map' });
    const tiles = this.map.addTilesetImage('map_sheet', 'tiles');
    const grass = this.map.createLayer('grass', tiles, 0, 0);
    this.trees = this.map.createLayer('trees', tiles, 0, 0);
    this.trees.setCollisionByExclusion([-1]);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { frames: [2, 5] }),
      frameRate: 5,
      repeat: -1,
    });

    // animation with key 'right'
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { frames: [9, 12] }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', { frames: [0, 1, 0, 4] }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', { frames: [8, 3, 8, 6] }),
      frameRate: 5,
      repeat: -1,
    });

    this.input.keyboard.on('keydown-Z', this.toggleMenu, this);
    this.input.keyboard.on('keydown-C', this.toggleChat, this);

    this.sys.events.on('wake', this.wake, this);
    this.events.on('StopMenu', this.toggleMenu, this);
    this.chatScene.events.on('SendChatMessage', this.sendMessage, this);
    this.socket.emit('PlayerName', Javascript.name);
  }

  addPlayer(playerInfo: playerInfoType) {
    console.log('Adding Player...');
    this.player = this.physics.add.sprite(0, 0, 'player', 8);
    const nameStyle = { font: '10px Arial', fill: '#ffffff' };
    this.playerName = this.add.text(-7, 5, Javascript.name, nameStyle);
    this.player.depth = 2;
    this.physics.world.bounds.width = this.map.widthInPixels;
    this.physics.world.bounds.height = this.map.heightInPixels;
    this.container = this.add.container(playerInfo.x, playerInfo.y);
    this.container.add(this.player);
    this.container.add(this.playerName);
    this.container.setSize(16, 16);
    this.physics.world.enable(this.container);
    this.player.setCollideWorldBounds(true);
    this.container.body.setVelocity(0).setBounce(0,0).setCollideWorldBounds(true);
    this.player.message = new ChatMessage(this, this.events, playerInfo.x, playerInfo.y - 5);
    this.add.existing(this.player.message);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.container);
    this.cameras.main.roundPixels = true;
    this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
    for (let i = 0; i < 100; i += 1) {
      const x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
      const y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
      // parameters are x, y, width, height
      if ((x > this.container.x + 32 || x < this.container.x - 32)
    && (y > this.container.y + 32 || y < this.container.y - 32)) {
        this.spawns.create(x, y, 20, 20);
      } else {
        i -= 1;
      }
    }
    this.physics.add.collider(this.container, this.trees);
    this.physics.add.overlap(this.container, this.spawns, this.onMeetEnemy, false, this);
  }

  addOtherPlayers(playerInfo: playerInfoType) {
    const otherPlayer = this.add.sprite(0, 0, 'otherPlayer', 8);
    const otherContainer = this.add.container(playerInfo.x, playerInfo.y);
    const nameStyle = { font: '10px Arial', fill: '#ffffff' };
    const otherPlayerName = this.add.text(-7, 5, playerInfo.name, nameStyle);
    otherContainer.add(otherPlayer);
    otherContainer.add(otherPlayerName);
    otherPlayer.playerId = playerInfo.playerId;
    otherPlayer.container = otherContainer;
    otherContainer.setSize(16, 16);
    this.physics.world.enable(otherContainer);
    otherContainer.body.setVelocity(0).setBounce(0, 0).setCollideWorldBounds(true);
    this.otherPlayers.add(otherPlayer);
  }

  update() {
    if (this.player) {
      const { x, y } = this.container;

      if (this.player.anims.currentFrame) {
        const frame = this.player.anims.currentFrame.textureFrame;
        if (this.oldPosition && (x !== this.oldPosition.x || y !== this.oldPosition.y
          || frame !== this.oldPosition.frame)) {
          this.socket.emit('playerMovement', { x, y, frame });
        }
      }
      this.player.body.setVelocity(0);
      this.container.body.setVelocity(0);
      if (!menuInformation.menuOn) {
        // Horizontal movement
        if (this.cursors.left.isDown) {
          // this.player.body.setVelocityX(-80);
          this.container.body.setVelocityX(-80);
        } else if (this.cursors.right.isDown) {
          // this.player.body.setVelocityX(80);
          this.container.body.setVelocityX(80);
        }
        // Vertical movement
        if (this.cursors.up.isDown) {
          // this.player.body.setVelocityY(-80);
          this.container.body.setVelocityY(-80);
        } else if (this.cursors.down.isDown) {
          // this.player.body.setVelocityY(80);
          this.container.body.setVelocityY(80);
        }
        if (this.cursors.left.isDown) {
          this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
          this.player.anims.play('right', true);
        } else if (this.cursors.up.isDown) {
          this.player.anims.play('up', true);
        } else if (this.cursors.down.isDown) {
          this.player.anims.play('down', true);
        } else {
          this.player.anims.stop();
        }
      } else {
        this.player.anims.stop();
      }

      if (this.player.anims.currentFrame) {
        this.oldPosition = {
          x: this.player.x,
          y: this.player.y,
          frame: this.player.anims.currentFrame.textureFrame,
        };
      }
    }
  }

  onMeetEnemy(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    zone: Phaser.GameObjects.Zone) {
    zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
    zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
    // TODO: Setup Battling
    this.cameras.main.shake(300);
    this.cameras.main.flash(300);
    setTimeout(() => {
      this.scene.switch('BattleScene');
    }, 250);
  }

  wake() {
    this.cursors.left.reset();
    this.cursors.right.reset();
    this.cursors.up.reset();
    this.cursors.down.reset();
  }

  toggleMenu() {
    console.log('Running Scene...');
    if (!menuInformation.menuOn) {
      this.scene.run('MenuScene');
      menuInformation.menuOn = true;
    } else {
      this.scene.stop('MenuScene');
      menuInformation.menuOn = false;
    }
  }

  toggleChat() {
    console.log('Running the chat...');
    if (!menuInformation.menuOn) {
      this.scene.run('ChatScene');
      menuInformation.menuOn = true;
    } else {
      this.scene.stop('ChatScene');
      menuInformation.menuOn = false;
    }
  }

  sendMessage(text: string) {
    console.log('Got to send message: ', text);
    this.scene.stop('ChatScene');
    this.socket.emit('PlayerMessage', text);
  }
}

export default WorldScene;
