class Level2 extends GameScene {
  constructor() {
    super({ key: 'Level2' });
  }

  create() {
    this.levelWidth = 1200;
    this.levelHeight = 1440;

    this.bg = this.add.rectangle(0, 0, config.width, config.height, 0x333333)
      .setOrigin(0, 0)
      .setScrollFactor(0);

    //Adding platforms
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(0, 656, 'rock-platform-normal').setOrigin(0, 0).refreshBody();

    this.addPlayer(64, 464);
    this.physics.add.collider(this.player, this.platforms);

    this.setup();
  }

  update() {
    this.playerControls();
  }
}
