import Phaser from 'phaser';
import { BootScene } from './engine/scenes/BootScene';
import { GameScene } from './engine/scenes/GameScene';
import { LevelSelectScene } from './engine/scenes/LevelSelectScene';
import { TitleScene } from './engine/scenes/TitleScene';
import './style.css';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'app',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false,
        },
    },
    scene: [BootScene, TitleScene, LevelSelectScene, GameScene],
};

const game = new Phaser.Game(config);

function fixViewportHeight() {
    const el = document.getElementById('app');
    if (!el) return;
    el.style.height = `${window.innerHeight}px`;
    game.scale.refresh();
}

window.addEventListener('resize', fixViewportHeight);
window.addEventListener('orientationchange', () => {
    // Slight delay to allow the browser to update dimensions
    setTimeout(fixViewportHeight, 100);
});

// Initial call
fixViewportHeight();
