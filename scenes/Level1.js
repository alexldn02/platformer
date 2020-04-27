class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: 'Level1' });
  }

  preload() {
    //Loading up assets
    this.load.image('platform', '../assets/grass-platform.png');
    this.load.image('cloud', '../assets/cloud.png');
    this.load.image('player', '../assets/player.png');
  }

  create() {
    //Adding background
    gameState.bg = this.add.rectangle(0, 0, config.width, config.height, 0x90ffff).setOrigin(0, 0);

    //Adding clouds
    gameState.clouds = this.physics.add.group({ allowGravity: false });
    for (let i=0;i<5;i++) {
      gameState.clouds.create(Math.random()*config.width, Math.random()*(config.height/2), 'cloud').setOrigin(0, 0.5).setVelocityX(Math.random()*75 + 25);
    }

    //Adding platforms
    gameState.platforms = this.physics.add.staticGroup();
    for (let i=0;i<5;i++) {
      gameState.platforms.create(i*256, 656, 'platform').setOrigin(0, 0).refreshBody();
    }

    //Adding player sprite
    gameState.player = this.physics.add.sprite(64, 464, 'player');
    this.physics.add.collider(gameState.player, gameState.platforms);

    //Adding controls
    gameState.cursors = this.input.keyboard.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

  }

  update() {
    //Cloud movement
    gameState.clouds.children.each((cloud) => {
      if (cloud.x > config.width) {
        cloud.x = -384;
        cloud.y = Math.random()*(config.height/2);
        cloud.setVelocityX(Math.random()*75 + 25);
      }
    });

    //Player movement
    if (gameState.cursors.d.isDown && gameState.cursors.a.isDown) {
      gameState.player.setVelocityX(0);
    } else if (gameState.cursors.d.isDown) {
      gameState.player.flipX = false;
      gameState.player.setVelocityX(400);
    } else if (gameState.cursors.a.isDown) {
      gameState.player.setVelocityX(-400);
      gameState.player.flipX = true;
    } else {
      gameState.player.setVelocityX(0);
    }

    //Jumping
    if (Phaser.Input.Keyboard.JustDown(gameState.cursors.space) && gameState.player.body.touching.down) {
      gameState.player.setVelocityY(-640);
    }
  }
}
