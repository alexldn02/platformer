class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: 'Level1' });
  }

  preload() {
    //Loading up assets
    this.load.image('cloud', 'assets/cloud.png');
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 64, frameHeight: 120 });
    this.load.image('platform-normal', 'assets/grass-platform/normal.png');
    this.load.image('platform-right', 'assets/grass-platform/right.png');
    this.load.image('platform-left', 'assets/grass-platform/left.png');
    this.load.image('platform-centre', 'assets/grass-platform/centre.png');
    this.load.image('mountains', 'assets/mountains.png');
    this.load.image('hills', 'assets/hills.png');
    this.load.image('sign', 'assets/sign.png');
    this.load.image('tutorial1', 'assets/tutorial/1.png');
    this.load.image('tutorial2', 'assets/tutorial/2.png');
    this.load.spritesheet('enemy', 'assets/bug.png', { frameWidth: 64, frameHeight: 48 });
  }

  create() {
    //Level dimensions
    gameState.levelWidth = 8000;
    gameState.levelHeight = 720;

    //Change cursor
    this.input.setDefaultCursor('url(assets/cursor.png), pointer');

    //Adding background
    gameState.bg = this.add.rectangle(0, 0, config.width, config.height, 0x90ffff)
      .setOrigin(0, 0)
      .setScrollFactor(0);

    gameState.mountains = this.add.image(0, 0, 'mountains')
      .setOrigin(0, 0);
    gameState.mountains.setScrollFactor((gameState.mountains.getBounds().width - config.width) / (gameState.levelWidth - config.width));

    gameState.hills = this.add.image(0, 0, 'hills')
      .setOrigin(0, 0);
    gameState.hills.setScrollFactor((gameState.hills.getBounds().width - config.width) / (gameState.levelWidth - config.width));

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
    for (let i=11;i<16;i+=2) {
      gameState.platforms.create(i*256, 656-(i-11)*64, 'platform-normal').setOrigin(0, 0).refreshBody();
    }
    gameState.platforms.create(4608, 592, 'platform-normal').setOrigin(0, 0).refreshBody();
    gameState.platforms.create(5376, 592, 'platform-normal').setOrigin(0, 0).refreshBody();
    gameState.platforms.create(5888, 656, 'platform-left').setOrigin(0, 0).refreshBody();
    for (let i=24;i<30;i++) {
      gameState.platforms.create(i*256, 656, 'platform-centre').setOrigin(0, 0).refreshBody();
    }
    gameState.platforms.create(7680, 656, 'platform-right').setOrigin(0, 0).refreshBody();

    //Adding signs
    gameState.tutorial1 = this.add.image(250, 376, 'tutorial1')
      .setOrigin(0, 0)
      .setDepth(20);
    gameState.tutorial1.visible = false;
    gameState.sign1 = this.add.image(328, 568, 'sign')
      .setOrigin(0, 0)
      .setInteractive()
      .on('pointerover', (pointer) => {
        gameState.tutorial1.visible = true;
        })
      .on('pointerout', (pointer) => {
        gameState.tutorial1.visible = false;
        });

    gameState.tutorial2 = this.add.image(1300, 376, 'tutorial2')
      .setOrigin(0, 0)
      .setDepth(20);
    gameState.tutorial2.visible = false;
    gameState.sign2 = this.add.image(1378, 568, 'sign')
      .setOrigin(0, 0)
      .setInteractive()
      .on('pointerover', (pointer) => {
        gameState.tutorial2.visible = true;
        })
      .on('pointerout', (pointer) => {
        gameState.tutorial2.visible = false;
        });

    //Adding enemy
    gameState.enemy = this.physics.add.sprite(1580, 560, 'enemy')
      .setVelocityX(100);
    this.physics.add.collider(gameState.enemy, gameState.platforms);

    //Adding player sprite
    gameState.player = this.physics.add.sprite(64, 464, 'player');
    this.physics.add.collider(gameState.player, gameState.platforms);
    this.physics.add.overlap(gameState.player, gameState.enemy, () => {
      this.death();
    });

    //Adding controls
    gameState.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
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
      key: 'playerrun',
      frames: this.anims.generateFrameNumbers('player', { start: 3, end: 4 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'enemyrun',
      frames: this.anims.generateFrameNumbers('enemy'),
      frameRate: 16,
      repeat: -1
    });
    gameState.enemy.anims.play('enemyrun', true);

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
    const right = gameState.cursors.d.isDown || gameState.cursors.right.isDown;
    const left = gameState.cursors.a.isDown || gameState.cursors.left.isDown;

    if (right && left) {
      gameState.player.anims.play('idle', true);
      gameState.player.setVelocityX(0);
    } else if (right) {
      gameState.player.flipX = false;
      gameState.player.anims.play('playerrun', true);
      gameState.player.setVelocityX(500);
    } else if (left) {
      gameState.player.setVelocityX(-500);
      gameState.player.flipX = true;
      gameState.player.anims.play('playerrun', true);
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
      this.death();
    }

    //Enemy movement
    if (gameState.enemy.x > 1980) {
      gameState.enemy.flipX = true;
      gameState.enemy.setVelocityX(-100);
    } else if (gameState.enemy.x < 1580) {
      gameState.enemy.setVelocityX(100);
      gameState.enemy.flipX = false;
    }
  }

  death() {
    gameState.player.visible = false;
    this.cameras.main.shake(240, 0.01, false, (camera, progress) => {
      if (progress > 0.9) {
        this.scene.restart('Level1');
      }
    });
  }
}
