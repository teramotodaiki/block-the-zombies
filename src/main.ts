import Phaser from 'phaser';
import { BootScene } from './engine/scenes/BootScene';
import { GameScene } from './engine/scenes/GameScene';
import { TitleScene } from './engine/scenes/TitleScene';
import { LevelSelectScene } from './engine/scenes/LevelSelectScene';
import './style.css';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800, // TBD: Adjust based on screen size
    height: 600, // TBD: Adjust based on screen size
    parent: 'app',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scene: [BootScene, TitleScene, LevelSelectScene, GameScene]
};

new Phaser.Game(config);
