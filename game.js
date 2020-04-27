const gameState = {};

const config = {
  type: Phaser.Auto,
  width: 1280,
  height: 720,
  backgroundColor: 'ffffff',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1024 },
      enableBody: true,
      //debug: true
    }
  },
  scene: [TitleScene, Level1]
};

var game = new Phaser.Game(config);
