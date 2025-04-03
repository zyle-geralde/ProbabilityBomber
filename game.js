
  class GameScene extends Phaser.Scene {
    constructor() {
      super({ key: 'GameScene' });
      this.wallGroup = null;
      this.player = null;
      this.cursors = null;
      this.wallDim = 64;
      this.cols = 19;
      this.rows = 8;
      this.totalWallWidth = this.cols * this.wallDim;
      this.totalWallHeight = this.rows * this.wallDim;
      this.speed = 150;
      this.cameraSpeed = 150;
      this.outsidewall = null;
      this.topwall = null;
      this.rightwall = null;
      this.bottomwall = null;
    }
  
    preload() {
      this.load.image("ground", "images/image 52.png");
      this.load.image("unbrkwall", "images/unbreakable_wall.png");
      this.load.spritesheet('character', 'images/spritesheet (2)nncopy.png', { frameWidth: 30, frameHeight: 50 });
    }
  
    create() {
      this.physics.world.setBounds(0, 0, 2000, 2000);
  
      this.createBackground();
      this.createWalls();
      this.createPlayer();
  
      this.cursors = this.input.keyboard.createCursorKeys();
    }
  
    update() {
      this.handleCollisions();
      this.handlePlayerMovement();
      this.handleCameraMovement();
    }
  
    createBackground() {
      this.add.sprite(-500, -500, 'ground').setOrigin(0, 0);
    }
    createWalls() {
        this.wallGroup = this.physics.add.group();
      
        this.createLeftWall();
        this.createTopWall();
        this.createRightWall();
        this.createBottomWall();
      
        // Calculate the center position
        const centerX = (window.innerWidth - this.totalWallWidth) / 2;
        const centerY = 100; // or any desired y-position
      
        // Set the wall group's position
        this.wallGroup.x = centerX;
        this.wallGroup.y = centerY;
      
        // Adjust children positions to be relative to the group
        this.wallGroup.children.iterate(wall => {
          wall.x += centerX;
          wall.y += centerY;
        });
      }
  
    createLeftWall() {
        this.outsidewall = this.physics.add.group({ immovable: true });
    
        let adjustwall = this.wallDim;
        for (let nn = 0; nn < this.rows; nn++) {
            let wall = this.outsidewall.create(0, adjustwall, 'unbrkwall');
            adjustwall+=this.wallDim
            wall.body.setSize(this.wallDim, this.wallDim);
          wall.setDisplaySize(this.wallDim, this.wallDim); // Corrected line
        }


      }
    
      createTopWall() {
        this.topwall = this.physics.add.group({ immovable: true });
    
        let adjusttopwall = 0;
        let skipColumn = false;
    
        for (let nn = 0; nn < this.cols; nn++) {
            let wall = this.topwall.create(adjusttopwall, 0, 'unbrkwall');
            adjusttopwall+=this.wallDim
          wall.body.setSize(this.wallDim, this.wallDim);
          wall.setDisplaySize(this.wallDim, this.wallDim); // Corrected line
    
          if (nn >= 1 && nn <= this.cols - 4 && !skipColumn) {
            let insidewall = this.wallDim * 2;
            let putWall = true;
    
            for (let bb = 1; bb <= this.rows - 3; bb++) {
              if (putWall) {
                  let innerWall = this.topwall.create(adjusttopwall, insidewall, 'unbrkwall');
                  insidewall+=this.wallDim
                innerWall.body.setSize(this.wallDim, this.wallDim);
                innerWall.setDisplaySize(this.wallDim, this.wallDim); // Corrected line
                putWall = false;
              } else {
                insidewall += this.wallDim;
                putWall = true;
              }
            }
            skipColumn = true;
          } else {
            skipColumn = false;
          }
          }
      }
    
      createRightWall() {
        this.rightwall = this.physics.add.group({ immovable: true });
    
        let adjustrightwall = this.wallDim;
        for (let nn = 0; nn < this.rows; nn++) {
            let wall = this.rightwall.create(this.totalWallWidth - this.wallDim, adjustrightwall, 'unbrkwall');
            adjustrightwall+=this.wallDim
          wall.body.setSize(this.wallDim, this.wallDim);
          wall.setDisplaySize(this.wallDim, this.wallDim); // Corrected line
          }
          
      }
    
      createBottomWall() {
        this.bottomwall = this.physics.add.group({ immovable: true });
    
        let adjustbottomwall = 0;
        for (let nn = 0; nn < this.cols; nn++) {
            let wall = this.bottomwall.create(adjustbottomwall, this.totalWallHeight, 'unbrkwall');
            adjustbottomwall+=this.wallDim
          wall.body.setSize(this.wallDim, this.wallDim);
          wall.setDisplaySize(this.wallDim, this.wallDim); // Corrected line
          }
      }
  
    createPlayer() {
      this.player = this.physics.add.sprite(500, 500, 'character');
      this.player.setScale(48 / 30, 70 / 50);
      this.player.setCollideWorldBounds(true);
  
      this.anims.create({ key: 'left', frames: this.anims.generateFrameNumbers('character', { start: 3, end: 5 }), frameRate: 10, repeat: -1 });
      this.anims.create({ key: 'right', frames: this.anims.generateFrameNumbers('character', { start: 0, end: 2 }), frameRate: 10, repeat: -1 });
      this.anims.create({ key: 'stopright', frames: [{ key: 'character', frame: 0 }], frameRate: 10, repeat: -1 });
    }
  
    handleCollisions() {
      this.physics.add.collider(this.player, this.outsidewall);
      this.physics.add.collider(this.player, this.topwall);
      this.physics.add.collider(this.player, this.rightwall);
      this.physics.add.collider(this.player, this.bottomwall);
    }
  
    handlePlayerMovement() {
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-this.speed);
        this.player.setVelocityY(0);
        this.player.anims.play('left', true);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(this.speed);
        this.player.setVelocityY(0);
        this.player.anims.play('right', true);
      } else if (this.cursors.up.isDown) {
        this.player.setVelocityY(-this.speed);
        this.player.setVelocityX(0);
        this.player.anims.play('right', true);
      } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(this.speed);
        this.player.setVelocityX(0);
        this.player.anims.play('left', true);
      } else {
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);
        this.player.anims.play('stopright');
      }
    }
  
    handleCameraMovement() {
      if (this.cursors.left.isDown && this.player.x < this.cameras.main.scrollX + 500) {
        this.cameras.main.scrollX -= this.cameraSpeed * this.game.loop.delta / 1000;
      } else if (this.cursors.right.isDown && this.player.x > this.cameras.main.scrollX + this.cameras.main.width - 500) {
        this.cameras.main.scrollX += this.cameraSpeed * this.game.loop.delta / 1000;
      } else if (this.cursors.up.isDown && this.player.y < this.cameras.main.scrollY + 300) {
        this.cameras.main.scrollY -= this.cameraSpeed * this.game.loop.delta / 1000;
      } else if (this.cursors.down.isDown && this.player.y > this.cameras.main.scrollY + this.cameras.main.height - 300) {
        this.cameras.main.scrollY += this.cameraSpeed * this.game.loop.delta / 1000;
      }
    }
  }
  
  const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false,
      },
    },
    scene: GameScene,
  };
  
  const game = new Phaser.Game(config);