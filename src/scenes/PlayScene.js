import BaseScene from './BaseScene';

const PIPES_RENDER_COUNT = 4;
const BEST_SCORE_KEY = 'bestScore';

class PlayScene extends BaseScene{
	constructor(config){
		super('PlayScene', config);

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

	create(){
	  super.create();
	  this.createBird();
	  this.createPipes();
	  this.createColliders();
	  this.createScore();
	  this.createPauseBtn();
	  this.handleInputs();	

	  console.log(this.bird);
	}

	update(time, delta){  
	  this.checkGameStatus();
	  this.recyclePipes();
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

	createPauseBtn(){
		const pauseBtn = this.physics.add.image(this.config.width -10, this.config.height - 10, 'pauseBtn')
										.setInteractive()
										.setScale(3)
										.setOrigin(1);
		pauseBtn.on('pointerdown', ()=>{
			this.physics.pause() && this.scene.pause();
		});									
	}

	createColliders(){
		this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
	}

	createScore(){
		const bestScore = localStorage.getItem(BEST_SCORE_KEY);

		this.score = 0;
		this.scoreText = this.add.text(16, 16 , `Score: ${0}`, { fontSize: '32px', fill: '#000'});
		this.add.text(16, 52 , `Best Score: ${bestScore || 0}`, { fontSize: '16px', fill: '#000'});
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
	        this.saveBestScore();
	      }
	    }
	  });
	}

	checkGameStatus(){
	  (this.bird.y <= 0 || this.bird.getBounds().bottom >= this.config.height) && this.gameOver();		
	}

	saveBestScore(){
	  const bestScoreText = localStorage.getItem(BEST_SCORE_KEY);
	  const bestScore = bestScoreText && parseInt(bestScoreText, 10);

	  if(!bestScore || this.score > bestScore){
	  	localStorage.setItem(BEST_SCORE_KEY, this.score);
	  }
	}

	gameOver(){
	  this.physics.pause();
	  this.bird.setTint(0xff0000);

	  this.saveBestScore();

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