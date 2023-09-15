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
		this.flapVelocity = 300;
		this.score = 0;
		this.scoreText = '';
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
	  this.createColliders();
	  this.createScore();
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
	  this.bird.body.gravity.y = 600;
	  this.bird.setCollideWorldBounds(true);
	}

	createPipes(){
	  this.pipes = this.physics.add.group();

	  for(let i = 0; i < PIPES_RENDER_COUNT; i++){
	    const upperPipe = this.pipes.create(0, 0, 'pipe')
	    							.setImmovable(true)
	    							.setOrigin(0, 1);
	    const lowerPipe = this.pipes.create(0, 0, 'pipe')
	    							.setImmovable(true)
	    							.setOrigin(0);

	    this.placePipe(upperPipe, lowerPipe);
	  }

	  this.pipes.setVelocityX(-200);
	  // pipe.body.allowGravity = false;
	  // bird.body.velocity.x = velocity;
	}

	createColliders(){
		this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
	}

	createScore(){
		this.score = 0;
		this.scoreText = this.add.text(16, 16 , `Score: ${0}`, { fontSize: '32px', fill: '#000'});
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
	        this.increaseScore();
	      }
	    }
	  });
	}

	checkGameStatus(){
	  (this.bird.y <= 0 || this.bird.getBounds().bottom >= this.config.height) && this.gameOver();		
	}

	gameOver(){
	  this.physics.pause();
	  this.bird.setTint(0xff0000);

	  this.time.addEvent({
	  	delay: 1000,
	  	callback: ()=>{
	  		this.scene.restart();
	  	},
	  	loop: false
	  })		
	}

	// MAIN FUNCTIONS
	flap(){
	  this.bird.body.velocity.y = -this.flapVelocity;
	}

	increaseScore(){
		this.score++;
		this.scoreText.setText(`Score: ${this.score}`);
	}

}

export default PlayScene;