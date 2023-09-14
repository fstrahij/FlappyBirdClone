import Phaser from 'phaser';

const PIPES_RENDER_COUNT = 4;

class PlayScene extends Phaser.Scene{
	constructor(config){
		super('PlayScene');

		this.config = config;

		this.bird = null;
		this.pipes = null;

		this.pipeVerticalDistanceRange = [100, 250];
		this.pipeHorizontalDistanceRange = [500, 550];
		this.pipeHorizontalDistance = 0;
		this.flapVelocity = 250;
	}

	// MAIN GAME FUNCTIONS
	// for loading images, sprites, animations
	preload(){
	  var assetsPath = 'assets/';
	  this.load.image('sky', assetsPath + 'sky.png');
	  this.load.image('bird', assetsPath + 'bird.png');
	  this.load.image('pipe', assetsPath + 'pipe.png');
	}

	create(){
	  this.createBG();
	  this.createBird();
	  this.createPipes();
	  this.handleInputs();	

	  console.log(this.bird);
	}

	update(time, delta){  
	  this.checkGameStatus();
	  this.recyclePipes();
	}

	createBG(){
	  this.add.image(0, 0, 'sky').setOrigin(0);
	}

	createBird(){
	  this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird').setOrigin(0);
	  this.bird.body.gravity.y = 400;
	}

	createPipes(){
	  this.pipes = this.physics.add.group();

	  for(let i = 0; i < PIPES_RENDER_COUNT; i++){
	    const upperPipe = this.pipes.create(0, 0, 'pipe').setOrigin(0, 1);
	    const lowerPipe = this.pipes.create(0, 0, 'pipe').setOrigin(0);

	    this.placePipe(upperPipe, lowerPipe);
	  }

	  this.pipes.setVelocityX(-200);
	  // pipe.body.allowGravity = false;
	  // bird.body.velocity.x = velocity;
	}

	handleInputs(){
	  this.input.on('pointerdown', this.flap, this);
	  this.input.keyboard.on('keydown_SPACE', this.flap, this);
	}

	placePipe(upperPipe, lowerPipe){
	  const pipeHorizontalDistance = Phaser.Math.Between(...this.pipeHorizontalDistanceRange) + this.getMostRightX();
	  const pipeVerticalDistance = Phaser.Math.Between(...this.pipeVerticalDistanceRange);
	  const pipeVerticalPosition = Phaser.Math.Between(0 + 20, this.config.height - 20 - pipeVerticalDistance);

	  [upperPipe.x, upperPipe.y] = [pipeHorizontalDistance, pipeVerticalPosition];
	  [lowerPipe.x, lowerPipe.y] = [upperPipe.x, upperPipe.y + pipeVerticalDistance];
	}

	getMostRightX(){
	  let rightMostX = 0;

	  this.pipes.getChildren().forEach(pipe =>  rightMostX = Math.max(pipe.x, rightMostX))
	  return rightMostX;
	}

	recyclePipes(){
	  let tempPipes = [];

	  this.pipes.getChildren().forEach( pipe => {
	    if (pipe.getBounds().right <= 0 ) {
	      tempPipes.push(pipe);

	      if (tempPipes.length === 2) {
	        this.placePipe(...tempPipes);
	      }
	    }
	  });
	}

	checkGameStatus(){
	  (this.bird.y <= 0 - this.bird.height || this.bird.y >= this.config.height) && this.restart();		
	}

	restart(){
	  this.bird.x = this.config.startPosition.x;
	  this.bird.y = this.config.startPosition.y;
	  this.bird.body.velocity.y = 0;
	}

	// MAIN FUNCTIONS
	flap(){
	  this.bird.body.velocity.y = -this.flapVelocity;
	}

}

export default PlayScene;