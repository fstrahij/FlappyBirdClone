import Phaser from 'phaser';
import PreloadScene from './scenes/PreloadScene';
import MenuScene from './scenes/MenuScene';
import PlayScene from './scenes/PlayScene';
import ScoreScene from './scenes/ScoreScene';
import PauseScene from './scenes/PauseScene';

const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSITION = { x: WIDTH / 10, y: HEIGHT / 2};
const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION
}

const scenes = [PreloadScene, MenuScene, ScoreScene, PlayScene, PauseScene];

const initScenes = () => scenes.map( scene => new scene(SHARED_CONFIG) );

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
      // gravity: { y: 400 }
    }
  },
  scene: initScenes()
}


new Phaser.Game(config);