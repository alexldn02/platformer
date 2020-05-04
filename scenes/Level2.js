class Level2 extends GameScene {
  constructor() {
    super({ key: 'Level2' });
  }

  create() {
    this.levelWidth = 12000;
    this.levelHeight = 1440;

    this.bg = this.add.rectangle(0, 0, config.width, config.height, 0x333333)
      .setOrigin(0, 0)
      .setScrollFactor(0);

    //Adding platforms
    this.platforms = this.physics.add.staticGroup();
    this.addPlat(0, 0, 'rock', 'normal');
    this.addPlat(2, -2, 'rock', 'left');
    this.addPlat(3, -2, 'rock', 'centre');
    this.addPlat(4, -2, 'rock', 'right');

    //Adding sign
    this.tutorial = this.add.image(512, 376, 'tutorial3')
      .setOrigin(0, 0)
      .setDepth(20);

    //Adding player
    this.addPlayer(64, 464);
    this.physics.add.collider(this.player, this.platforms);
    this.player.hasGun = false;

    //Adding gun sprite
    this.gun = this.physics.add.image(896, 750, 'gun');
    this.physics.add.collider(this.gun, this.platforms);

    this.physics.add.overlap(this.player, this.gun, () => {
      this.gun.destroy();
      this.player.hasGun = true;
    });

    //Adding gun shooting
    this.bullets = this.physics.add.group();
    this.physics.add.collider(this.bullets, this.platforms);

    this.input.on('pointerdown', () => {
      if (this.player.hasGun) {
        let bullet = this.bullets.create(this.player.x, this.player.y-8, 'bullet');
        if (!this.player.body.touching.down) {
          bullet.setVelocityY(-4000);
        } else {
          bullet.setVelocityX(this.player.flipX ? -4000 : 4000);
        }

      }
    });

    this.setup();
  }

  update() {
    this.playerControls();
  }
}
