import Phaser from 'phaser'

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
      // gravity: { y: 400 }
    }
  },
  scene: {
    preload,
    create,
    update
  }
}

const PIPES_RENDER_COUNT = 4;

const initialBirdPosition = { x: config.width / 10, y: config.height / 2 };
const pipeVerticalDistanceRange = [100, 250];
const pipeHorizontalDistanceRange = [500, 550];
const flapVelocity = 250;

let bird = null;
let pipes = null;

let upperPipe = null;
let lowerPipe = null;
let pipeHorizontalDistance = 0;

// MAIN GAME FUNCTIONS
// for loading images, sprites, animations
function preload(){
  var assetsPath = 'assets/';
  this.load.image('sky', assetsPath + 'sky.png');
  this.load.image('bird', assetsPath + 'bird.png');
  this.load.image('pipe', assetsPath + 'pipe.png');
}

function create(){
  this.add.image(0, 0, 'sky').setOrigin(0);
  bird = this.physics.add.sprite(initialBirdPosition.x, initialBirdPosition.y, 'bird').setOrigin(0);
  bird.body.gravity.y = 400;

  pipes = this.physics.add.group()

  for(let i = 0; i < PIPES_RENDER_COUNT; i++){
    upperPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 1);
    lowerPipe = pipes.create(0, 0, 'pipe').setOrigin(0);

    placePipe(upperPipe, lowerPipe);
  }

  pipes.setVelocityX(-200);
  // pipe.body.allowGravity = false;
  // bird.body.velocity.x = velocity;

  this.input.on('pointerdown', flap);
  this.input.keyboard.on('keydown_SPACE', flap);

  console.log(bird);
}

function placePipe(upperPipe, lowerPipe){
  const pipeHorizontalDistance = Phaser.Math.Between(...pipeHorizontalDistanceRange) + getMostRightX();
  const pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
  const pipeVerticalPosition = Phaser.Math.Between(0 + 20, config.height - 20 - pipeVerticalDistance);

  [upperPipe.x, upperPipe.y] = [pipeHorizontalDistance, pipeVerticalPosition];
  [lowerPipe.x, lowerPipe.y] = [upperPipe.x, upperPipe.y + pipeVerticalDistance];
}

function getMostRightX(){
  let rightMostX = 0;

  pipes.getChildren().forEach(pipe =>  rightMostX = Math.max(pipe.x, rightMostX))
  return rightMostX;
}

function recyclePipes(){
  let tempPipes = [];

  pipes.getChildren().forEach( pipe => {
    if (pipe.getBounds().right <= 0 ) {
      tempPipes.push(pipe);

      if (tempPipes.length === 2) {
        placePipe(...tempPipes);
      }
    }
  });
}

function update(time, delta){  
  (bird.y <= 0 - bird.height || bird.y >= config.height) && restart();
  recyclePipes();
}

function restart(){
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = 0;
}

// MAIN FUNCTIONS
function flap(){
  bird.body.velocity.y = -flapVelocity;
}

new Phaser.Game(config);