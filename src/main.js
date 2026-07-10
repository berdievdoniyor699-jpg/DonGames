import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import GameScene from './scenes/GameScene.js';
import AngryBootScene from './scenes/AngryBootScene.js';
import AngryGameScene from './scenes/AngryGameScene.js';

let currentGame = null;

function startMario() {
  if (currentGame) currentGame.destroy(true);
  
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 600 },
        debug: false
      }
    },
    scene: [BootScene, GameScene]
  };
  
  currentGame = new Phaser.Game(config);
}

function startAngryBirds() {
  if (currentGame) currentGame.destroy(true);
  
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
      default: 'matter',
      matter: {
        gravity: { y: 1 },
        debug: false,
        enableSleeping: true
      }
    },
    scene: [AngryBootScene, AngryGameScene]
  };
  
  currentGame = new Phaser.Game(config);
}

document.getElementById('btn-mario').addEventListener('click', startMario);
document.getElementById('btn-birds').addEventListener('click', startAngryBirds);

// --- ЛОГИКА МАГАЗИНА ---
const shopModal = document.getElementById('shop-modal');
const btnShop = document.getElementById('btn-shop');
const btnCloseShop = document.getElementById('btn-close-shop');
const shopCoinsSpan = document.getElementById('shop-coins');

function updateShopUI() {
  const totalCoins = parseInt(localStorage.getItem('totalCoins') || '0');
  shopCoinsSpan.innerText = totalCoins;
  
  const unlocked = JSON.parse(localStorage.getItem('unlockedSkins') || '["player_mario"]');
  const selected = localStorage.getItem('selectedSkin') || 'player_mario';
  
  document.querySelectorAll('.btn-buy-skin').forEach(btn => {
    const skin = btn.getAttribute('data-skin');
    const price = parseInt(btn.getAttribute('data-price'));
    
    if (skin === selected) {
      btn.innerText = 'Выбрано';
      btn.disabled = true;
      btn.style.background = '#888';
    } else if (unlocked.includes(skin)) {
      btn.innerText = 'Выбрать';
      btn.disabled = false;
      btn.style.background = '#4CAF50';
    } else {
      btn.innerText = `Купить (${price})`;
      btn.disabled = (totalCoins < price);
      btn.style.background = (totalCoins < price) ? '#ff9800' : '#4CAF50';
    }
    
    btn.onclick = () => {
      // Если еще не куплено и хватает денег - покупаем
      if (!unlocked.includes(skin) && totalCoins >= price) {
        localStorage.setItem('totalCoins', totalCoins - price);
        unlocked.push(skin);
        localStorage.setItem('unlockedSkins', JSON.stringify(unlocked));
      }
      
      // Если скин разблокирован - выбираем его
      if (unlocked.includes(skin)) {
        localStorage.setItem('selectedSkin', skin);
        updateShopUI();
        
        // Перезапускаем игру, чтобы применить новый скин, если мы играем в Марио
        if (currentGame && currentGame.config.scene[0].name === 'BootScene') {
            startMario();
        }
      }
    };
  });
}

document.addEventListener('coinsUpdated', updateShopUI);

btnShop.addEventListener('click', () => {
  shopModal.style.display = 'block';
  updateShopUI();
});

btnCloseShop.addEventListener('click', () => {
  shopModal.style.display = 'none';
});

// Запуск игры по умолчанию
startMario();
