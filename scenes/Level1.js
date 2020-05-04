class Level1 extends GameScene {
  constructor() {
    super({ key: 'Level1' });
  }

  create() {
    //Level dimensions
    this.levelWidth = 8000;
    this.levelHeight = 720;

    //Adding background
    this.bg = this.add.rectangle(0, 0, config.width, config.height, 0x90ffff)
      .setOrigin(0, 0)
      .setScrollFactor(0);

    this.mountains = this.add.image(0, 0, 'mountains')
      .setOrigin(0, 0);
    this.mountains.setScrollFactor((this.mountains.getBounds().width - config.width) / (this.levelWidth - config.width));

    this.hills = this.add.image(0, 0, 'hills')
      .setOrigin(0, 0);
    this.hills.setScrollFactor((this.hills.getBounds().width - config.width) / (this.levelWidth - config.width));

    //Adding clouds
    this.clouds = this.physics.add.group({ allowGravity: false });
    for (let i=0;i<5;i++) {
      this.clouds.create(Math.random()*config.width, Math.random()*(config.height/2), 'cloud')
        .setVelocityX(Math.random()*75 + 25)
        .setScale(0.5 + i*0.2)
        .setOrigin(0, 0.5)
        .setScrollFactor(0);
    }

    //Adding platforms
    this.platforms = this.physics.add.staticGroup();
    this.addPlat(0, 0, 'grass', 'left');
    for (let i=1;i<9;i++) {
      this.addPlat(i, 0, 'grass', 'centre');
    }
    this.addPlat(9, 0, 'grass', 'right');
    this.addPlat(2, 3, 'grass', 'normal');
    this.addPlat(3, 4, 'grass', 'normal');
    for (let i=11;i<16;i+=2) {
      this.addPlat(i, i-11, 'grass', 'normal');
    }
    this.addPlat(18, 1, 'grass', 'normal');
    this.addPlat(21, 1, 'grass', 'normal');
    this.addPlat(23, 0, 'grass', 'left');
    for (let i=24;i<30;i++) {
      this.addPlat(i, 0, 'grass', 'centre');
    }
    this.addPlat(30, 0, 'grass', 'right');

    //Adding signs
    this.tutorial1 = this.add.image(250, 376, 'tutorial1')
      .setOrigin(0, 0)
      .setDepth(20);
    this.tutorial1.visible = false;
    this.sign1 = this.add.image(328, 568, 'sign')
      .setOrigin(0, 0)
      .setInteractive()
      .on('pointerover', (pointer) => {
        this.tutorial1.visible = true;
        })
      .on('pointerout', (pointer) => {
        this.tutorial1.visible = false;
        });

    this.tutorial2 = this.add.image(1300, 376, 'tutorial2')
      .setOrigin(0, 0)
      .setDepth(20);
    this.tutorial2.visible = false;
    this.sign2 = this.add.image(1378, 568, 'sign')
      .setOrigin(0, 0)
      .setInteractive()
      .on('pointerover', (pointer) => {
        this.tutorial2.visible = true;
        })
      .on('pointerout', (pointer) => {
        this.tutorial2.visible = false;
        });

    //Adding level ending
    this.cave = this.add.image(7168, 400, 'cave')
      .setOrigin(0, 0);
    this.caveEntrance = this.physics.add.staticImage(7440, 488, 'cave-entrance')
      .setOrigin(0, 0)
      .refreshBody()
      .setInteractive();

    //Adding enemies
    this.enemies = this.physics.add.group();
    this.enemies.create(1780, 560, 'enemy-bug')
      .setVelocityX(100)
      .originalPos = 1780;
    this.enemies.create(6200, 560, 'enemy-bug')
      .setVelocityX(100)
      .originalPos = 6200;
    this.enemies.create(6800, 560, 'enemy-bug')
      .setVelocityX(100)
      .originalPos = 6800;
    this.physics.add.collider(this.enemies, this.platforms);

    this.addPlayer(64, 464);

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.enemies, () => {
      this.death();
    });
    this.physics.add.overlap(this.player, this.caveEntrance, () => {
      this.cameras.main.fade(800, 0, 0, 0, false, (camera, progress) => {
        if (progress > .9) {
          this.scene.stop('Level1');
          this.scene.start('Level2');
        }
      });
    }, null, this);

    //Adding animations
    this.anims.create({
      key: 'bugrun',
      frames: this.anims.generateFrameNumbers('enemy-bug'),
      frameRate: 16,
      repeat: -1
    });
    this.enemies.children.each((enemy) => {
      enemy.anims.play('bugrun', true)
    });

    this.setup();
  }

  update() {
    this.playerControls();

    //Cloud movement
    this.clouds.children.each((cloud) => {
      if (cloud.x > config.width) {
        cloud.x = -384 * cloud.scale;
        cloud.y = Math.random()*(config.height/2);
        cloud.setVelocityX(Math.random()*75 + 25);
      }
    });

    //Enemy movement
    this.enemies.children.each((enemy) => {
      if (enemy.x > enemy.originalPos + 200) {
        enemy.flipX = true;
        enemy.setVelocityX(-100);
      } else if (enemy.x < enemy.originalPos - 200) {
        enemy.setVelocityX(100);
        enemy.flipX = false;
      }
    });

    if (Phaser.Input.Keyboard.JustDown(this.cursors.s)) {
      this.scene.stop('Level1');
      this.scene.start('Level2');
    }
  }
}
