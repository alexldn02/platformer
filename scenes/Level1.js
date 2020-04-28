class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: 'Level1' });
  }

  preload() {
    //Loading up assets
    this.load.image('cloud', '../assets/cloud.png');
    this.load.spritesheet('player', '../assets/player.png', { frameWidth: 64, frameHeight: 128 });
    this.load.image('platform-normal', '../assets/grass-platform/normal.png');
    this.load.image('platform-right', '../assets/grass-platform/right.png');
    this.load.image('platform-left', '../assets/grass-platform/left.png');
    this.load.image('platform-centre', '../assets/grass-platform/centre.png');
  }

  create() {

    //Level dimensions
    gameState.levelWidth = 3000;
    gameState.levelHeight = 720;

    //Adding background
    gameState.bg = this.add.rectangle(0, 0, config.width, config.height, 0x90ffff)
      .setOrigin(0, 0)
      .setScrollFactor(0);

    //Adding clouds
    gameState.clouds = this.physics.add.group({ allowGravity: false });
    for (let i=0;i<5;i++) {
      gameState.clouds.create(Math.random()*config.width, Math.random()*(config.height/2), 'cloud')
        .setVelocityX(Math.random()*75 + 25)
        .setScale(0.5 + i*0.2)
        .setOrigin(0, 0.5)
        .setScrollFactor(0);
    }

    //Adding platforms
    gameState.platforms = this.physics.add.staticGroup();
    gameState.platforms.create(0, 656, 'platform-left').setOrigin(0, 0).refreshBody();
    for (let i=1;i<9;i++) {
      gameState.platforms.create(i*256, 656, 'platform-centre').setOrigin(0, 0).refreshBody();
    }
    gameState.platforms.create(2304, 656, 'platform-right').setOrigin(0, 0).refreshBody();
    gameState.platforms.create(512, 464, 'platform-normal').setOrigin(0, 0).refreshBody();
    gameState.platforms.create(768, 400, 'platform-normal').setOrigin(0, 0).refreshBody();

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

    //Adding animations
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('player', { start: 2, end: 2 }),
      frameRate: 0,
      repeat: -1
    });
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('player', { start: 3, end: 4 }),
      frameRate: 10,
      repeat: -1
    });

    //Setting up camera
    this.cameras.main.setBounds(0, 0, gameState.levelWidth, gameState.levelHeight);
    this.physics.world.setBounds(0, 0, gameState.levelWidth, gameState.levelHeight + gameState.player.height);
    this.cameras.main.startFollow(gameState.player, false , 0.1, 0.1);
  }

  update() {
    //Cloud movement
    gameState.clouds.children.each((cloud) => {
      if (cloud.x > config.width) {
        cloud.x = -384 * cloud.scale;
        cloud.y = Math.random()*(config.height/2);
        cloud.setVelocityX(Math.random()*75 + 25);
      }
    });

    //Player movement
    if (gameState.cursors.d.isDown && gameState.cursors.a.isDown) {
      gameState.player.anims.play('idle', true);
      gameState.player.setVelocityX(0);
    } else if (gameState.cursors.d.isDown) {
      gameState.player.flipX = false;
      gameState.player.anims.play('run', true);
      gameState.player.setVelocityX(500);
    } else if (gameState.cursors.a.isDown) {
      gameState.player.setVelocityX(-500);
      gameState.player.flipX = true;
      gameState.player.anims.play('run', true);
    } else {
      gameState.player.setVelocityX(0);
      gameState.player.anims.play('idle', true);
    }

    //Jumping
    if (Phaser.Input.Keyboard.JustDown(gameState.cursors.space) && gameState.player.body.touching.down) {
      gameState.player.setVelocityY(-750);
    }
    if (!gameState.player.body.touching.down) {
      gameState.player.anims.play('jump', true);
    }

    //Dying from falling out of world
    if (gameState.player.y > gameState.levelHeight) {
      this.cameras.main.shake(240, 0.01, false, (camera, progress) => {
        if (progress > 0.9) {
          this.scene.restart('Level1');
        }
      });
    }
  }
}
