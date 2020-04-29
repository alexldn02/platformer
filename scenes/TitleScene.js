class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  preload() {
    //Loading up assets
    this.load.image('bg', 'assets/title-screen.png');
  }

  create() {
    //Change cursor
    this.input.setDefaultCursor('url(assets/cursor.png), pointer');

    //Add title screen image
    this.add.image(640, 360, 'bg');

    //Click to start
    this.input.on('pointerup', () => {
      this.scene.stop('TitleScene');
      this.scene.start('Level1');
    })
  }

}
