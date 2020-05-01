class TitleScene extends GameScene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  preload() {
    //Loading up assets
    this.load.image('title-screen', 'assets/title-screen.png');

    this.load.image('cloud', 'assets/cloud.png');
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 64, frameHeight: 120 });
    this.load.image('grass-platform-normal', 'assets/grass-platform/normal.png');
    this.load.image('grass-platform-right', 'assets/grass-platform/right.png');
    this.load.image('grass-platform-left', 'assets/grass-platform/left.png');
    this.load.image('grass-platform-centre', 'assets/grass-platform/centre.png');
    this.load.image('mountains', 'assets/mountains.png');
    this.load.image('hills', 'assets/hills.png');
    this.load.image('sign', 'assets/sign.png');
    this.load.image('tutorial1', 'assets/tutorial/1.png');
    this.load.image('tutorial2', 'assets/tutorial/2.png');
    this.load.spritesheet('enemy-bug', 'assets/enemy/bug.png', { frameWidth: 64, frameHeight: 48 });
    this.load.image('cave', 'assets/cave.png');
    this.load.image('cave-entrance', 'assets/cave-entrance.png');

    this.load.image('rock-platform-normal', 'assets/rock-platform/normal.png');
  }

  create() {
    //Change cursor
    this.addCursor();

    //Add title screen image
    this.add.image(640, 360, 'title-screen');

    //Click to start
    this.input.on('pointerup', () => {
      this.scene.stop('TitleScene');
      this.scene.start('Level1');
    })
  }

}
