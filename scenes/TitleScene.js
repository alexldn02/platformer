class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  preload() {
    this.load.image('bg', '../assets/title-screen.png');
  }

  create() {
    this.add.image(640, 360, 'bg');

    this.input.on('pointerup', () => {
      this.scene.stop('TitleScene');
      this.scene.start('Level1');
    })
  }

}
