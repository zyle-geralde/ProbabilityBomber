const game = new Phaser.Game(
    window.innerWidth,  
    window.innerHeight,
    Phaser.AUTO,
    '',
    {
    preload: preload,
    create: create,
    update: update
})

let wallGroup;
let outsidewall;
let topwall;
let rightwall;
let bottomwall;
let cursors;

function preload() {
    game.load.image("ground", "images/image 52.png")
    game.load.image("unbrkwall", "images/unbreakable_wall.png")
    game.load.spritesheet('character', 'images/spritesheet (2)nncopy.png', 30, 50)
}
function create() {

    game.world.setBounds(0, 0, 2000, 2000);

    //50x50 wall
    const wallDim = 64

    let cols = 20; // Number of columns (top/bottom walls)
    let rows = 9;  // Number of rows (left/right walls)
    
    // Calculate total width and height of walls
    let totalWallWidth = cols * wallDim; 
    let totalWallHeight = rows * wallDim;
    

    game.physics.startSystem(Phaser.Physics.ARCADE)

    let bg = game.add.sprite(0, 0, 'ground');

    //Uncomment this if needed
    /*bg.anchor.set(0.5, 0.5);  //Set anchor to center
    bg.position.set(game.width / 2, game.height / 2);  //Center image*/

    //Maintain aspect ratio while filling the screen
    /*let scaleX = game.width / bg.width;
    let scaleY = game.height / bg.height;
    let scale = Math.max(scaleX, scaleY);//Use the larger scale factor

    bg.scale.setTo(scale, scale);*/

    wallGroup = game.add.group();//group of all walls


    //-------------------------left wall------------------------------
    outsidewall = game.add.group()
    wallGroup.add(outsidewall);
    outsidewall.enableBody = true//Adds physics like collisions and stuff


    let adjustwall = wallDim
    for (var nn = 0; nn < rows; nn++){
        let wall = outsidewall.create(0, adjustwall, 'unbrkwall')
        adjustwall += wallDim
        wall.body.immovable = true//objects wont move
        wall.width = wallDim
        wall.height = wallDim

        wall.enableBody = true
    }

    //----------------------top wall-------------------------
    topwall = game.add.group()
    wallGroup.add(topwall);
    topwall.enableBody = true

    let adjusttopwall = 0;

    for (var nn = 0; nn < cols; nn++){
        let wall = topwall.create(adjusttopwall,0,  'unbrkwall')
        adjusttopwall += wallDim
        wall.body.immovable = true//objects wont move
        wall.width = wallDim
        wall.height = wallDim

        wall.enableBody = true

        //inside walls
        let insidetopwall = game.add.group()
        wallGroup.add(insidetopwall);
        insidetopwall.enableBody = true

        if (nn >=1 && nn<=cols-4) {
            let insidewall = wallDim +wallDim
            for (var bb = 1; bb <= rows-3; bb++){
                let wall = topwall.create(adjusttopwall,insidewall,  'unbrkwall')
                insidewall+=wallDim
                wall.body.immovable = true//objects wont move
                wall.width = wallDim
                wall.height = wallDim
        
                wall.enableBody = true
            }
        }
    }


    //--------------------right wall-------------------------------
    rightwall = game.add.group()
    wallGroup.add(rightwall);
    rightwall.enableBody = true//Adds physics like collisions and stuff


    let adjustrightwall = wallDim
    for (var nn = 0; nn < rows; nn++){
        let wall = rightwall.create(totalWallWidth - wallDim, adjustrightwall, 'unbrkwall');
        adjustrightwall += wallDim
        wall.body.immovable = true//objects wont move
        wall.width = wallDim
        wall.height = wallDim

        wall.enableBody = true
    }


    //----------------bottomwall-----------------------------------
    bottomwall = game.add.group()
    wallGroup.add(bottomwall);
    bottomwall.enableBody = true

    let adjustbottomwall = 0;

    for (var nn = 0; nn < cols; nn++){
        let wall = bottomwall.create(adjustbottomwall, totalWallHeight, 'unbrkwall');
        adjustbottomwall += wallDim
        wall.body.immovable = true//objects wont move
        wall.width = wallDim
        wall.height = wallDim

        wall.enableBody = true
    }


    //center wall group position
    /*wallGroup.x = (game.world.width - totalWallWidth) / 2;
    wallGroup.y = (game.world.height - totalWallHeight) / 2;*/

    wallGroup.x = (window.innerWidth- totalWallWidth) / 2;
    wallGroup.y = 100;

    

    //--------------------------------------Player Initiallize------------------------------
    player = game.add.sprite(500, 500, 'character')
    game.physics.arcade.enable(player)
    player.scale.setTo(45 / player.width, 64 / player.height); //change player height and width
    //player.body.bounce.y = 0.2
    player.body.collideWorldBounds = true

    player.animations.add('left', [3,4 , 5], 10, true)
    player.animations.add('right', [0, 1, 2], 10, true)
    player.animations.add('stopright', [0], 10, true)

    cursors = game.input.keyboard.createCursorKeys()


}
function update() {
    game.physics.arcade.collide(player, bottomwall)
    game.physics.arcade.collide(player, topwall)
    game.physics.arcade.collide(player, rightwall)
    game.physics.arcade.collide(player, outsidewall)


    let speed = 150; // Player movement speed
    let cameraSpeed = 200; // Camera movement speed

    if (cursors.left.isDown) {
        player.body.velocity.x = -speed;
        player.body.velocity.y = 0;
        player.animations.play('left');
        
        // Move camera only if player reaches left boundary
        if (player.x < game.camera.x + 500) {
            game.camera.x -= cameraSpeed * game.time.physicsElapsed;
        }
    } 
    else if (cursors.right.isDown) {
        player.body.velocity.x = speed;
        player.body.velocity.y = 0;
        player.animations.play('right');

        // Move camera only if player reaches right boundary
        if (player.x > game.camera.x + game.width - 500) {
            game.camera.x += cameraSpeed * game.time.physicsElapsed;
        }
    } 
    else if (cursors.up.isDown) {
        player.body.velocity.y = -speed;
        player.body.velocity.x = 0;
        player.animations.play('right');

        // Move camera only if player reaches top boundary
        if (player.y < game.camera.y + 300) {
            game.camera.y -= cameraSpeed * game.time.physicsElapsed;
        }
    } 
    else if (cursors.down.isDown) {
        player.body.velocity.y = speed;
        player.body.velocity.x = 0;
        player.animations.play('left');

        // Move camera only if player reaches bottom boundary
        if (player.y > game.camera.y + game.height - 300) {
            game.camera.y += cameraSpeed * game.time.physicsElapsed;
        }
    } 
    else {
        // Stop player when no key is pressed
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        player.animations.stop();
        player.animations.play('stopright');
    }
}

 