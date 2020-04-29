const gameState = {};

const config = {
  type: Phaser.Auto,
  width: 1280,
  height: 720,
  backgroundColor: '000000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1024 },
      enableBody: true,
      debug: true
    }
  },
  scene: [TitleScene, Level1]
};

var game = new Phaser.Game(config);
