const gameManager = {

    async newGame() {
        this.setNewGame();
        this.startGameTicks();
        // CREATE GAME OBJECTS
        // START THE GAME
            // DRAW GAME OBJECTS
            // do stuff...
    },

    setNewGame() {
        //Barriers around the play field

        let obj;

        gameData.gameObjects.barriers.push(
            gameData.objectModels.barrier()
        );

        obj = gameData.gameObjects.barriers[gameData.gameObjects.barriers.length - 1];
        obj.xPosition = 100;
        obj.yPosition = 200;
        obj.height = 50;
        obj.width = 100;
        obj.color = "yellow";

        gameData.gameObjects.barriers.push(
            gameData.objectModels.barrier()
        );

        obj = gameData.gameObjects.barriers[gameData.gameObjects.barriers.length - 1];
        obj.xPosition = 0;
        obj.yPosition = 0;
        obj.height = gameData.gameSize.height;
        obj.width = 50;


        gameData.gameObjects.balls.push(
            gameData.objectModels.ball()
        );

        obj = gameData.gameObjects.balls[gameData.gameObjects.balls.length - 1];
        // Placing the ball to the center
        obj.xPosition = gameData.gameSize.width/2 - obj.width/2; 
        obj.yPosition = gameData.gameSize.height/2 - obj.height/2;


        gameData.gameObjects.players.push(
            gameData.objectModels.player()
        );

        obj = gameData.gameObjects.players[gameData.gameObjects.players.length - 1];
        obj.xPosition = gameData.gameSize.width - 100;
        // Place player to the vertical middle
        obj.yPosition = gameData.gameSize.height/2 - obj.height/2;
        obj.height = 100;
        obj.width = 66;
        obj.color = "green";
    },

    afterGoalReset() {

    },

    gameInProgress: false,

    stopGameTicks() {
        this.gameInProgress = false;
    },

    handleGameStep() {
        graphicsManager.drawAllObjects();
        // draw everything
        // compute energies
        // resolve movements
        // resolve situations - goals etc.
    },

    startGameTicks(fps = 2) {
        // try to use requestAnimationFrame
        // https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe

        this.gameInProgress = true;
        let fpsInterval, now, then, elapsed;

        startAnimating(fps);
        
        // initialize the timer variables and start the animation
        
        function startAnimating(fps) {
            fpsInterval = 1000 / fps;
            then = Date.now();
            startTime = then;
            animate();
        }


        function animate() {

            // request another frame
            if (!gameManager.gameInProgress) {
                return;
            }

            requestAnimationFrame(animate);
        
            // calc elapsed time since last loop
            now = Date.now();
            elapsed = now - then;
        
            // if enough time has elapsed, draw the next frame
        
            if (elapsed > fpsInterval) {
        
                // Get ready for next frame by setting then=now, but also adjust for your
                // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
                then = now - (elapsed % fpsInterval);

                console.log("animating");

                gameManager.handleGameStep();
            }
        }

    },

};