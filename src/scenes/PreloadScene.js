import Phaser from 'phaser';

class PreloadScene extends Phaser.Scene{
	constructor(){
		super('PreloadScene');
	}

	// for loading images, sprites, animations
	preload(){
	  var assetsPath = 'assets/';
	  this.load.image('sky', assetsPath + 'sky.png');
	  //frame height = image height(48px) / horizonatal number of images(3) = 16
	  //frame width = image width(128px) / vertical number of images(8) = 16
	  this.load.spritesheet('bird', assetsPath + 'birdSprite.png', {
	  	frameHeight: 16,
	  	frameWidth: 16
	  });
	  this.load.image('pipe', assetsPath + 'pipe.png');
	  this.load.image('pauseBtn', assetsPath + 'pause.png');
	  this.load.image('backBtn', assetsPath + 'back.png');
	}

	create(){
		this.scene.start('MenuScene');
	}
}

export default PreloadScene;