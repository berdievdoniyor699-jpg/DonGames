import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    // Получаем текущий выбранный скин, либо дефолтный
    const skin = localStorage.getItem('selectedSkin') || 'player_mario';
    super(scene, x, y, skin);
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    
    this.speed = 250;
    this.jumpForce = -500;
  }

  update() {
    const left = this.cursors.left.isDown || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;
    const up = this.cursors.up.isDown || this.wasd.up.isDown;

    if (left) {
      this.setVelocityX(-this.speed);
      this.setFlipX(true); // Разворачиваем влево
    } else if (right) {
      this.setVelocityX(this.speed);
      this.setFlipX(false); // Смотрим вправо
    } else {
      this.setVelocityX(0);
    }

    if (up && this.body.touching.down) {
      this.setVelocityY(this.jumpForce);
    }
  }
}
