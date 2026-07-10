import Phaser from 'phaser';
import Player from '../gameObjects/Player.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  init(data) {
    this.level = data.level || 1;
    this.score = data.score || 0;
  }

  create() {
    this.gameOver = false;
    
    const levelConfig = {
      1: {
        bounds: 2400,
        ground: [400, 1400, 2200],
        platforms: [
          { x: 600, y: 400, scale: 0.5 },
          { x: 900, y: 300, scale: 0.5 },
          { x: 1200, y: 450, scale: 0.3 },
          { x: 1700, y: 350, scale: 0.4 },
          { x: 1900, y: 250, scale: 0.3 }
        ],
        coins: { startX: 500, stepX: 150, repeat: 9 },
        flagX: 2300
      },
      2: {
        bounds: 3000,
        ground: [400, 1200, 2800],
        platforms: [
          { x: 600, y: 450, scale: 0.3 },
          { x: 800, y: 350, scale: 0.2 },
          { x: 1000, y: 250, scale: 0.2 },
          { x: 1400, y: 400, scale: 0.4 },
          { x: 1600, y: 250, scale: 0.2 },
          { x: 1800, y: 150, scale: 0.2 },
          { x: 2100, y: 300, scale: 0.3 },
          { x: 2400, y: 400, scale: 0.3 }
        ],
        coins: { startX: 600, stepX: 200, repeat: 10 },
        flagX: 2900
      },
      3: {
        bounds: 4000,
        ground: [400, 3800], 
        platforms: [
          { x: 600, y: 450, scale: 0.2 },
          { x: 900, y: 400, scale: 0.2 },
          { x: 1200, y: 350, scale: 0.2 },
          { x: 1500, y: 300, scale: 0.2 },
          { x: 1800, y: 250, scale: 0.2 },
          { x: 2100, y: 200, scale: 0.2 },
          { x: 2400, y: 150, scale: 0.2 },
          { x: 2800, y: 300, scale: 0.3 },
          { x: 3100, y: 450, scale: 0.2 },
          { x: 3400, y: 350, scale: 0.2 }
        ],
        coins: { startX: 700, stepX: 300, repeat: 9 },
        flagX: 3900
      }
    };

    const config = levelConfig[this.level];

    this.physics.world.setBounds(0, 0, config.bounds, 600);
    this.cameras.main.setBackgroundColor('#87CEEB');

    this.platforms = this.physics.add.staticGroup();

    config.ground.forEach(x => {
      this.platforms.create(x, 568, 'ground');
    });

    config.platforms.forEach(p => {
      this.platforms.create(p.x, p.y, 'platform').setScale(p.scale).refreshBody();
    });

    this.player = new Player(this, 100, 450);

    this.coins = this.physics.add.group({
      key: 'coin',
      repeat: config.coins.repeat,
      setXY: { x: config.coins.startX, y: 0, stepX: config.coins.stepX }
    });
    this.coins.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.flag = this.physics.add.staticImage(config.flagX, 486, 'flag');

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.coins, this.platforms);

    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
    this.physics.add.overlap(this.player, this.flag, this.reachFinish, null, this);

    this.cameras.main.setBounds(0, 0, config.bounds, 600);
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

    this.scoreText = this.add.text(16, 16, `Уровень: ${this.level} | Очки: ${this.score}`, { fontSize: '24px', fill: '#000', fontStyle: 'bold' });
    this.scoreText.setScrollFactor(0);
  }

  update() {
    if (this.gameOver) return;
    this.player.update();
    if (this.player.y > 600) this.loseGame();
  }

  collectCoin(player, coin) {
    coin.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText(`Уровень: ${this.level} | Очки: ${this.score}`);
    
    // Сохраняем монетки в кошелек для магазина
    let totalCoins = parseInt(localStorage.getItem('totalCoins') || '0');
    localStorage.setItem('totalCoins', totalCoins + 1);
    document.dispatchEvent(new Event('coinsUpdated')); // Обновляем UI, если открыт
  }

  reachFinish(player, flag) {
    this.gameOver = true;
    this.physics.pause();
    
    if (this.level < 3) {
        this.showMessage('УРОВЕНЬ ПРОЙДЕН!', '#00ff00');
        this.time.delayedCall(2000, () => {
          this.scene.start('GameScene', { level: this.level + 1, score: this.score });
        });
    } else {
        this.showMessage('ИГРА ПРОЙДЕНА!', '#00ff00');
        this.time.delayedCall(3000, () => {
          this.scene.start('BootScene');
        });
    }
  }

  loseGame() {
    this.gameOver = true;
    this.physics.pause();
    this.player.setTint(0xff0000);

    this.showMessage('ИГРА ОКОНЧЕНА', '#ff0000');

    this.time.delayedCall(2000, () => {
      this.scene.start('GameScene', { level: this.level, score: 0 });
    });
  }

  showMessage(text, color) {
    const msg = this.add.text(400, 300, text, { fontSize: '48px', fill: color, stroke: '#000', strokeThickness: 4 });
    msg.setOrigin(0.5);
    msg.setScrollFactor(0);
  }
}
