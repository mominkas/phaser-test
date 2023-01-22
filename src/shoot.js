var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default : 'arcade',
        arcade: {
            gravity: { y:5 },
            debug: false
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config); //creates instance of Phaser Game and wakes up the library
let player;
let alien;
let shot;
let xSpeed = 0;
let ySpeed = 0;
let alienXSpeed = 1;
let alienYSpeed = 1;
const ACCEL = 8;
let alienAcce1 = 4;
let accuracy = 50;
let score = 0;
let scoreText = "";
let timerText = "";
let timer=0;
let interval;
let gameover = false;

function preload ()
{
    this.load.image('background', 'assets/background.png');
    this.load.image('crosshair', 'assets/FinalCross2.png');
    this.load.audio('shot', 'assets/shootingAudio.mp3');
    this.load.audio('hitsound', 'assets/short-explosion.wav');
    this.load.audio('backgroundmusic', 'assets/backgroundmusic.mp3')
    this.load.spritesheet('explosion', 'assets/try-explosion.png', {frameWidth: 120, frameHeight: 100 });
    this.load.spritesheet('alien', 'assets/final-final-necro.png', {frameWidth: 160, frameHeight: 100 });
}

function create ()
{
    this.add.image(400, 300, 'background');
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    timerText = this.add.text(600, 16, 'timer: 0', { fontSize: '32px', fill: '#000' });
    alien = this.physics.add.sprite(200, 450, 'alien');
    alien.setCollideWorldBounds(true);
    player = this.physics.add.sprite(400, 300, 'crosshair');
    player.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();
    enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    shot = this.sound.add('shot');
    backgroundmusic = this.sound.add('backgroundmusic');
    hitsound = this.sound.add('hitsound')

    this.anims.create({
        key: 'cycle',
        frames: this.anims.generateFrameNumbers('alien', {start: 0, end: 8}),
        frameRate: 5,
        repeat: -1
    });

    this.anims.create({
        key: 'explode',
        frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 4}),
        frameRate: 10,
        repeat: 0
    });
    
    alien.anims.play('cycle', true);
    backgroundmusic.play();
    interval = setInterval(function(){
        timer += 1;
        timerText.setText('timer: ' + timer);
        if(timer >=61){
            gameover = true;
            endGame();
        }
    }, 1000);
}

function update()
{
    if(gameover){
        return;
    }

    //AlienMovement
    if(alien.x >= 720){
        alien.x = 719;
        alienXSpeed = alienXSpeed * (-1);
        alien.setVelocityX(alienXSpeed);}
        else if(alien.x <= 80){
            alien.x = 81;
            alienXSpeed = alienXSpeed * (-1);
            alien.setVelocityX(alienXSpeed);
    } else {
            alien.x = alien.x + alienXSpeed;

    }

  //  if(alien.x <= -50){
  //      alien.x = -49;
  //      alienXSpeed = alienXSpeed * (-1);
  //      alien.setVelocityX(alienXSpeed);
  //  }  else {
  //      alien.x = alien.x + alienXSpeed;
  //  }

    if(alien.y >= 520){
        alien.y = 519;
        alienYSpeed = alienYSpeed * (-1);
        alien.setVelocityY(alienYSpeed);
    } else if(alien.y <= 80){
        alien.y = 81;
        alienYSpeed = alienYSpeed * (-1);
        alien.setVelocityY(alienYSpeed);}
        else {
           alien.y = alien.y + alienYSpeed;}

 //  if(alien.y <= -50){
 //       alien.y = -49;
 //      alienYSpeed = alienYSpeed * (-1);
 //       alien.setVelocityY(alienYSpeed);
 //   } else {
 //           alien.y = alien.y + alienYSpeed;
 //   }

    //Cursor Movement

    if(cursors.left.isDown){
        xSpeed = xSpeed - ACCEL
        player.setVelocityX(xSpeed);
    }
    if(cursors.right.isDown){
        xSpeed = xSpeed + ACCEL
        player.setVelocityX(xSpeed);
    }
    if(cursors.up.isDown){
        ySpeed = ySpeed - ACCEL
        player.setVelocityY(ySpeed);
    }
    if(cursors.down.isDown){
        ySpeed = ySpeed + ACCEL
        player.setVelocityY(ySpeed);
    }
    

    if(Phaser.Input.Keyboard.JustDown(enter)) {
        //fire
        shot.play();
        if(Math.abs(player.x - alien.x) < accuracy && Math.abs(player.y - alien.y) < accuracy){
            hit();
        } else {
            miss();        
        }

    }

    
}

function hit(){
    hitsound.play();
    score = score + 10;
    scoreText.setText('Score: ' + score);
    //recycle Alien
    alien.on('animationcomplete', function(){
        alien.anims.play('cycle', true);
        resetPlayer();
    });

    alien.anims.play('explode', true);
}

function miss(){
    score = score - 5;
    scoreText.setText('Score: ' + score);

}

function resetPlayer(){
    player.x = 400;
    player.y = 300;
    player.setVelocityX(0);
    player.setVelocityY(0);
    xSpeed = 0;
    ySpeed = 0;
    
}

function endGame(){
    alien.destroy();
    player.destroy();
    timerText.setText(' ');
    clearInterval(interval);

}







