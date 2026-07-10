import Phaser from 'phaser';

export default class AngryGameScene extends Phaser.Scene {
  constructor() {
    super('AngryGameScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#87CEEB');

    // Земля 
    this.matter.add.image(400, 550, 'aground', null, { isStatic: true });

    // Строим замок из блоков
    this.blocks = [];
    this.blocks.push(this.matter.add.image(550, 460, 'wood', null, { density: 0.001 }));
    this.blocks.push(this.matter.add.image(550, 380, 'wood', null, { density: 0.001 }));
    this.blocks.push(this.matter.add.image(650, 460, 'wood', null, { density: 0.001 }));
    this.blocks.push(this.matter.add.image(650, 380, 'wood', null, { density: 0.001 }));
    this.blocks.push(this.matter.add.image(600, 330, 'woodLong', null, { density: 0.001 }));
    
    // Свинья
    this.pigs = [];
    const pig = this.matter.add.image(600, 480, 'pig', null, { shape: 'circle', density: 0.001, restitution: 0.5 });
    this.pigs.push(pig);

    // Координаты старта
    this.birdStartX = 150;
    this.birdStartY = 400;

    // Графика для резинок рогатки
    this.slingshotGraphics = this.add.graphics();
    this.drawSlingshot(this.birdStartX, this.birdStartY);

    // Птица
    // Добавляем sleepThreshold: -1, чтобы Matter.js не усыплял птицу при удержании
    this.bird = this.matter.add.image(this.birdStartX, this.birdStartY, 'bird', null, { 
        shape: 'circle', restitution: 0.5, density: 0.005, sleepThreshold: -1
    });
    this.bird.setIgnoreGravity(true);

    this.isDragging = false;
    this.birdLaunched = false;

    // НАДЕЖНАЯ СИСТЕМА УПРАВЛЕНИЯ РОГАТКОЙ (ГЛОБАЛЬНЫЕ КЛИКИ)
    this.input.on('pointerdown', (pointer) => {
        if (this.birdLaunched) return;
        // Если кликнули рядом с птицей - начинаем тянуть
        const dist = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.bird.x, this.bird.y);
        if (dist < 40) {
            this.isDragging = true;
        }
    });

    this.input.on('pointermove', (pointer) => {
        if (!this.isDragging || this.birdLaunched) return;
        
        let dist = Phaser.Math.Distance.Between(this.birdStartX, this.birdStartY, pointer.x, pointer.y);
        if (dist > 100) dist = 100;
        let angle = Phaser.Math.Angle.Between(this.birdStartX, this.birdStartY, pointer.x, pointer.y);
        
        let newX = this.birdStartX + Math.cos(angle) * dist;
        let newY = this.birdStartY + Math.sin(angle) * dist;
        
        // Вручную двигаем птицу и перерисовываем резинки
        this.bird.setPosition(newX, newY);
        // Сбрасываем лишние силы, чтобы она не пыталась улететь при перетаскивании
        this.bird.setVelocity(0, 0);
        
        this.drawSlingshot(newX, newY);
    });

    const releaseBird = () => {
        if (!this.isDragging || this.birdLaunched) return;
        this.isDragging = false;
        this.birdLaunched = true;
        
        // Убираем резинки, оставляем только столб
        this.slingshotGraphics.clear();
        this.slingshotGraphics.lineStyle(8, 0x5c2e0b, 1);
        this.slingshotGraphics.beginPath();
        this.slingshotGraphics.moveTo(150, 420);
        this.slingshotGraphics.lineTo(150, 550);
        this.slingshotGraphics.strokePath();
        
        // Включаем гравитацию и задаем скорость
        this.bird.setIgnoreGravity(false);
        if (this.bird.setAwake) this.bird.setAwake(); // Пробуждаем физическое тело
        
        let dx = this.birdStartX - this.bird.x;
        let dy = this.birdStartY - this.bird.y;
        
        this.bird.setVelocity(dx * 0.25, dy * 0.25);
    };

    // Обрабатываем отпускание мыши везде (даже если курсор ушел за пределы игры)
    this.input.on('pointerup', releaseBird);
    this.input.on('pointerupoutside', releaseBird);

    // UI элементы
    this.add.text(10, 10, 'Натяни красную птичку и отпусти!', { fontSize: '20px', fill: '#000' });
    this.scoreText = this.add.text(10, 40, 'Свиней: 1', { fontSize: '20px', fill: '#000' });
    
    const restartBtn = this.add.text(10, 80, '[ПЕРЕЗАГРУЗИТЬ УРОВЕНЬ]', { fontSize: '18px', fill: '#ff0000', cursor: 'pointer' });
    restartBtn.setInteractive();
    restartBtn.on('pointerdown', () => this.scene.restart());

    this.gameOver = false;
  }

  // Отрисовка рогатки
  drawSlingshot(birdX, birdY) {
      this.slingshotGraphics.clear();
      
      this.slingshotGraphics.lineStyle(4, 0x301608, 1);
      this.slingshotGraphics.beginPath();
      this.slingshotGraphics.moveTo(140, 420);
      this.slingshotGraphics.lineTo(birdX, birdY);
      this.slingshotGraphics.strokePath();
      
      this.slingshotGraphics.beginPath();
      this.slingshotGraphics.moveTo(160, 420);
      this.slingshotGraphics.lineTo(birdX, birdY);
      this.slingshotGraphics.strokePath();
      
      this.slingshotGraphics.lineStyle(8, 0x5c2e0b, 1);
      this.slingshotGraphics.beginPath();
      this.slingshotGraphics.moveTo(150, 420);
      this.slingshotGraphics.lineTo(150, 550);
      this.slingshotGraphics.strokePath();
  }

  update() {
    if (this.gameOver) return;

    for (let i = this.pigs.length - 1; i >= 0; i--) {
        const pig = this.pigs[i];
        const speed = Math.sqrt(pig.body.velocity.x ** 2 + pig.body.velocity.y ** 2);
        if (speed > 7 || pig.y > 600 || pig.x > 800 || pig.x < 0) {
            pig.destroy();
            this.pigs.splice(i, 1);
        }
    }

    this.scoreText.setText('Свиней: ' + this.pigs.length);

    if (this.pigs.length === 0) {
        this.gameOver = true;
        const winText = this.add.text(400, 200, 'СВИНКА ПОВЕРЖЕНА!', { fontSize: '48px', fill: '#00ff00', stroke: '#000', strokeThickness: 4 });
        winText.setOrigin(0.5);
        this.time.delayedCall(3000, () => this.scene.restart());
    }
  }
}
