class GameScene extends Phaser.Scene {

  setup() {
    //Change cursor
    this.addCursor();

    //Adding controls
    this.cursors = this.input.keyboard.addKeys({
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

    //Setting up camera
    this.cameras.main.setBounds(0, 0, this.levelWidth, this.levelHeight);
    this.physics.world.setBounds(0, 0, this.levelWidth, this.levelHeight + this.player.height);
    this.cameras.main.startFollow(this.player, false , 0.1, 0.1);
  }

  addCursor() {
    this.input.setDefaultCursor('url(assets/cursor.png), pointer');
  }

  addPlayer(x, y) {
    //Adding player sprite
    this.player = this.physics.add.sprite(x, y, 'player');

    //Adding player animations
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
      key: 'idle-gun',
      frames: this.anims.generateFrameNumbers('player', { start: 5, end: 6 }),
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: 'jump-gun',
      frames: this.anims.generateFrameNumbers('player', { start: 7, end: 7 }),
      frameRate: 0,
      repeat: -1
    });
    this.anims.create({
      key: 'playerrun-gun',
      frames: this.anims.generateFrameNumbers('player', { start: 8, end: 9 }),
      frameRate: 10,
      repeat: -1
    });
  }

  death() {
    //Death sequence
    this.player.visible = false;
    this.cameras.main.shake(240, 0.01, false, (camera, progress) => {
      if (progress > 0.9) {
        this.scene.restart('Level1');
      }
    });
  }

  playerControls() {
    //Player movement
    const right = this.cursors.d.isDown || this.cursors.right.isDown;
    const left = this.cursors.a.isDown || this.cursors.left.isDown;

    let idle = this.player.hasGun ? 'idle-gun' : 'idle';
    let run = this.player.hasGun ? 'playerrun-gun' : 'playerrun';

    if (right && left) {
      this.player.anims.play(idle, true);
      this.player.setVelocityX(0);
    } else if (right) {
      this.player.flipX = false;
      this.player.anims.play(run, true);
      this.player.setVelocityX(500);
    } else if (left) {
      this.player.setVelocityX(-500);
      this.player.flipX = true;
      this.player.anims.play(run, true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play(idle, true);
    }

    //Jumping
    let jump = this.player.hasGun ? 'jump-gun' : 'jump';

    if (Phaser.Input.Keyboard.JustDown(this.cursors.space) && this.player.body.touching.down) {
      this.player.setVelocityY(-750);
    }
    if (!this.player.body.touching.down) {
      this.player.anims.play(jump, true);
    }

    //Dying from falling out of world
    if (this.player.y > this.levelHeight) {
      this.death();
    }

  }

  addPlat(gridX, gridY, texture, type) {
    let x = gridX * 256;
    let y = (config.height - 64) - gridY * 64;
    let key = texture + '-platform-' + type;
    this.platforms.create(x, y, key).setOrigin(0, 0).refreshBody();
  }
}
