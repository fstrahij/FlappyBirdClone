import BaseScene from './BaseScene';

const PIPES_RENDER_COUNT = 4;
const BEST_SCORE_KEY = 'bestScore';
const DIFFICULTY = {
	EASY: 'EASY',
	NORMAL: 'NORMAL',
	HARD: 'HARD'
};

class PlayScene extends BaseScene{
	constructor(config){
		super('PlayScene', config);

		this.bird = null;
		this.pipes = null;
		this.pauseBtn = null;
		this.isPaused = false;

		this.pipeHorizontalDistance = 0;
		this.flapVelocity = 300;
		this.currentDifficulty = DIFFICULTY.EASY;
		this.difficulties = {
			'EASY': {
				pipeHorizontalDistanceRange: [300, 350],
				pipeVerticalDistanceRange: [150, 200]
			},
			'NORMAL': {
				pipeHorizontalDistanceRange: [280, 330],
				pipeVerticalDistanceRange: [140, 190]
			},
			'HARD': {
				pipeHorizontalDistanceRange: [250, 310],
				pipeVerticalDistanceRange: [120, 170]
			}
		}

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
	  this.listenEvents();		  
	}

	update(time, delta){  
	  this.checkGameStatus();
	  this.recyclePipes();
	}

	createBird(){
	  this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird')
	  							  .setFlipX(true)	
	  							  .setScale(3)
	  							  .setOrigin(0);
	  
	  this.bird.setBodySize(this.bird.width, this.bird.height - 7);
	  this.bird.body.gravity.y = 600;
	  this.bird.setCollideWorldBounds(true);

	  this.anims.create({
	  	key: 'fly',
	  	frames: this.anims.generateFrameNumbers('bird', {start: 9, end: 15}),
	  	//24 fps default, it will play animation consisting of 24 frames in second
	  	// in case of frameRate 2 and sprite of 8 frames animation will play in
	  	// 4 sec; 8 / 2 = 4
	  	frameRate: 8,
	  	//it will repeat indefinitely
	  	repeat: -1
	  });

	  this.bird.play('fly');
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
		this.isPaused = false;
		this.pauseBtn = this.physics.add.image(this.config.width -10, this.config.height - 10, 'pauseBtn')
										.setInteractive()
										.setScale(3)
										.setOrigin(1);
		this.pauseBtn.on('pointerdown', ()=> {
			this.isPaused = true;
			this.physics.pause() && this.scene.pause();
			this.pauseBtn.disableInteractive();
			this.scene.launch('PauseScene');
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

	listenEvents(){	
		if(this.pauseEvent) { return; }

		this.pauseEvent = this.events.on('resume', ()=>{

			this.initialTime = 3;	

			this.countdownText = this.add.text(this.screenCenter.x, this.screenCenter.y, `Fly in: ${this.initialTime}`, this.fontOptions)
										.setOrigin(0.5, 1);	

			this.timedEvent = this.time.addEvent({
				delay: 1000,
				callback: this.countdown,
				callbackScope: this,
				loop: true
			});
		});
	}

	countdown(){
		this.initialTime--;
		this.countdownText.setText(`Fly in: ${this.initialTime}`);
		if(this.initialTime <= 0){
			this.isPaused = false;
			this.countdownText.setText('');
			this.physics.resume();
			this.pauseBtn.setInteractive();
			this.timedEvent.remove();
		}
	}

	placePipe(upperPipe, lowerPipe){
	  const difficulty = this.difficulties[ this.currentDifficulty ];
	  const pipeHorizontalDistance = Phaser.Math.Between(...difficulty.pipeHorizontalDistanceRange) + this.getMostRightX();
	  const pipeVerticalDistance = Phaser.Math.Between(...difficulty.pipeVerticalDistanceRange);
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
	        this.setDifficulty();
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

	setDifficulty(){
		console.log(this.currentDifficulty);

		if(this.score > 3){
			this.currentDifficulty = DIFFICULTY.NORMAL;
		}

		if(this.score > 5){
			this.currentDifficulty = DIFFICULTY.HARD;
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
	  if(this.isPaused) { return; }		
	  this.bird.body.velocity.y = -this.flapVelocity;
	}

	increaseScore(){
		this.score++;
		this.scoreText.setText(`Score: ${this.score}`);
	}

}

export default PlayScene;