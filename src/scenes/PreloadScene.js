import Phaser from 'phaser';

class PreloadScene extends Phaser.Scene{
	constructor(){
		super('PreloadScene');
	}

	// for loading images, sprites, animations
	preload(){
	  var assetsPath = 'assets/';
	  this.load.image('sky', assetsPath + 'sky.png');
	  this.load.image('bird', assetsPath + 'bird.png');
	  this.load.image('pipe', assetsPath + 'pipe.png');
	  this.load.image('pauseBtn', assetsPath + 'pause.png');
	  this.load.image('backBtn', assetsPath + 'back.png');
	}

	create(){
		this.scene.start('MenuScene');
	}
}

export default PreloadScene;