import Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';
import MenuScene from './scenes/MenuScene';
import PreloadScene from './scenes/PreloadScene'

const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSITION = { x: WIDTH / 10, y: HEIGHT / 2};
const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION
}

const scenes = [PreloadScene, MenuScene, PlayScene];

const initScenes = () => scenes.map( scene => new scene(SHARED_CONFIG) );

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
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