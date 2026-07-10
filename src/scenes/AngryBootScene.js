import Phaser from 'phaser';

export default class AngryBootScene extends Phaser.Scene {
  constructor() {
    super('AngryBootScene');
  }

  preload() {
    // Птичка (Красная)
    const birdGraph = this.add.graphics();
    birdGraph.fillStyle(0xff0000, 1);
    birdGraph.fillCircle(15, 15, 15);
    birdGraph.fillStyle(0x000000, 1);
    birdGraph.fillCircle(20, 10, 3); // глаз
    birdGraph.generateTexture('bird', 30, 30);
    birdGraph.destroy();

    // Свинья (Зеленая)
    const pigGraph = this.add.graphics();
    pigGraph.fillStyle(0x00ff00, 1);
    pigGraph.fillCircle(15, 15, 15);
    pigGraph.fillStyle(0x000000, 1);
    pigGraph.fillCircle(10, 10, 3);
    pigGraph.fillCircle(20, 10, 3);
    pigGraph.generateTexture('pig', 30, 30);
    pigGraph.destroy();

    // Деревянный квадратный блок
    const woodGraph = this.add.graphics();
    woodGraph.fillStyle(0x8B4513, 1);
    woodGraph.lineStyle(2, 0x5c2e0b, 1);
    woodGraph.fillRect(0, 0, 40, 80);
    woodGraph.strokeRect(0, 0, 40, 80);
    woodGraph.generateTexture('wood', 40, 80);
    woodGraph.destroy();

    // Длинная доска
    const woodLongGraph = this.add.graphics();
    woodLongGraph.fillStyle(0x8B4513, 1);
    woodLongGraph.lineStyle(2, 0x5c2e0b, 1);
    woodLongGraph.fillRect(0, 0, 120, 20);
    woodLongGraph.strokeRect(0, 0, 120, 20);
    woodLongGraph.generateTexture('woodLong', 120, 20);
    woodLongGraph.destroy();

    // Земля
    const groundGraph = this.add.graphics();
    groundGraph.fillStyle(0x2E8B57, 1);
    groundGraph.fillRect(0, 0, 800, 100);
    groundGraph.generateTexture('aground', 800, 100);
    groundGraph.destroy();
  }

  create() {
    this.scene.start('AngryGameScene');
  }
}
