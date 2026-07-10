import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  generateSkin(key, colorR, colorU) {
    const canvas = this.textures.createCanvas(key, 32, 32);
    const ctx = canvas.getContext();
    const pixels = [
      "....RRRRR.......",
      "...RRRRRRRRR....",
      "...BBBSOSB......",
      "..BSBBSOSBSSS...",
      "..BSBBSOSBSSS...",
      "..BBSSSSBBBB....",
      "...SSSSSSS......",
      "..RRUBBRR.......",
      ".RRRRUBRRRR.....",
      "RRRRRRUBRRRR....",
      "SSRRRUUURRSS....",
      "SSSRRUUURRSSS...",
      "BBUUUBBBUUUBB...",
      "..UUU...UUU.....",
      ".BBB.....BBB....",
      "BBBB.....BBBB..."
    ];
    const colors = {
      'R': colorR, 
      'B': '#5c3a21', 
      'S': '#ffcc99', 
      'O': '#000000', 
      'U': colorU  
    };
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const char = pixels[y][x];
        if (colors[char]) {
          ctx.fillStyle = colors[char];
          ctx.fillRect(x * 2, y * 2, 2, 2);
        }
      }
    }
    canvas.refresh();
  }

  preload() {
    // Генерируем 3 разных скина
    this.generateSkin('player_mario', '#ff0000', '#0000ff'); // Красный Марио
    this.generateSkin('player_luigi', '#00aa00', '#0000ff'); // Зеленый Луиджи
    this.generateSkin('player_wario', '#ffff00', '#800080'); // Желто-фиолетовый Варио

    const platformGraphics = this.add.graphics();
    platformGraphics.fillStyle(0x228B22, 1);
    platformGraphics.fillRect(0, 0, 400, 32);
    platformGraphics.generateTexture('platform', 400, 32);
    platformGraphics.destroy();
    
    const groundGraphics = this.add.graphics();
    groundGraphics.fillStyle(0x8B4513, 1);
    groundGraphics.fillRect(0, 0, 800, 64);
    groundGraphics.generateTexture('ground', 800, 64);
    groundGraphics.destroy();

    const coinGraphics = this.add.graphics();
    coinGraphics.fillStyle(0xffd700, 1);
    coinGraphics.fillCircle(10, 10, 10);
    coinGraphics.generateTexture('coin', 20, 20);
    coinGraphics.destroy();

    const flagGraphics = this.add.graphics();
    flagGraphics.fillStyle(0xffffff, 1);
    flagGraphics.fillRect(0, 0, 10, 100);
    flagGraphics.fillStyle(0x00ff00, 1);
    flagGraphics.fillTriangle(10, 0, 10, 30, 40, 15);
    flagGraphics.generateTexture('flag', 40, 100);
    flagGraphics.destroy();
  }

  create() {
    this.scene.start('GameScene', { level: 1, score: 0 });
  }
}
