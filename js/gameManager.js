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

        const gameSize = gameData.gameSize;
        this.resetGameObjects();

        // 2 players game
        // TODO: X players game
        // settings will set teams, AIs etc.
        this.addOuterBarriers();
        this.addGoalArea(gameSize.width*0.07, gameSize.height*0.25, gameSize.width*0.1, gameSize.height*0.5, "right", "green");
        this.addGoalArea(gameSize.width*0.83, gameSize.height*0.25, gameSize.width*0.1, gameSize.height*0.5, "left", "purple");
        this.addPlayer(gameSize.width*0.035, gameSize.height/2, "coral");
        this.addPlayer(gameSize.width*0.965, gameSize.height/2, "blue", {
            up: gameData.keyNumbers.w,
            down: gameData.keyNumbers.s,
            left: gameData.keyNumbers.a,
            right: gameData.keyNumbers.d,
            special: gameData.keyNumbers.j,
            special2: gameData.keyNumbers.k
        });
        this.addBall(gameData.gameSize.width/2, gameData.gameSize.height/2);
    },

    resetGameObjects() {
        gameData.gameObjects = {
            balls: [],
            players: [],
            barriers: [],
            goalAreas: [],
        }
    },

    addBall(x, y, color = "red") {
        // !!!!!!!! X and Y are center of the ball in this case!
        // This is because we want to center the ball in the field!

        const ball = gameData.objectModels.ball();
        ball.xPosition = x - ball.width/2;
        ball.yPosition = y - ball.height/2;
        ball.color = color;
        gameData.gameObjects.balls.push(ball);
    },

    addPlayer(x, y, color = "yellow", controls) {
        // !!! X and Y are center of the player here!
        const player = gameData.objectModels.player();
        player.xPosition = x - player.width/2;
        player.yPosition = y - player.height/2;
        player.color = color;
        if (controls) {player.controls = controls}
        gameData.gameObjects.players.push(player);
    },

    addGoalArea(x, y, width, height, leftOrRight, color = "violet") {
        // adds goal area surrounded by barriers from all but one side

        const newBarriers = [];
        newBarriers.push(gameData.objectModels.barrier());
        newBarriers.push(gameData.objectModels.barrier());
        newBarriers.push(gameData.objectModels.barrier());

        const newGoalAreas = [];
        newGoalAreas.push(gameData.objectModels.goalArea());

        let obj;

        switch(leftOrRight) {
            case "left":
            // goal area opened at the left side

                // upper barrier
                obj = newBarriers[0];
                obj.xPosition = x;
                obj.yPosition = y;
                obj.width = width - obj.height;

                // right barrier
                obj = newBarriers[1];
                obj.xPosition = x + width - obj.width;
                obj.yPosition = y + obj.width;
                obj.height = height - 2*obj.width;

                // lower barrier
                obj = newBarriers[2];
                obj.xPosition = x;
                obj.yPosition = y + height - obj.height;
                obj.width = width - obj.height;

                obj = newGoalAreas[0];
                obj.xPosition = x
                obj.yPosition = y + newBarriers[0].height;
                obj.height = height - 2*newBarriers[0].height;
                obj.width = width - newBarriers[1].width;
                obj.color = color;
            break;
            case "right":
            // goal area opened at the right side

                // upper barrier
                obj = newBarriers[0];
                obj.xPosition = x + obj.height;
                obj.yPosition = y;
                obj.width = width - obj.height;

                // left barrier
                obj = newBarriers[1];
                obj.xPosition = x;
                obj.yPosition = y + newBarriers[0].height;
                obj.height = height - 2*obj.width;

                // lower barrier
                obj = newBarriers[2];
                obj.xPosition = x + obj.height;
                obj.yPosition = y + height - obj.height;
                obj.width = width - obj.height;

                obj = newGoalAreas[0];
                obj.xPosition = x + newBarriers[1].width;
                obj.yPosition = y + newBarriers[0].height;
                obj.height = height - 2*newBarriers[0].height;
                obj.width = width - newBarriers[1].width;
                obj.color = color
            break;
        }
        
        gameData.gameObjects.barriers = gameData.gameObjects.barriers.concat(newBarriers);
        gameData.gameObjects.goalAreas = gameData.gameObjects.goalAreas.concat(newGoalAreas);
    },

    addOuterBarriers() {

        let barr;
        const barriersArray = [];

        for (let i = 0; i < 4; i++) {
            barriersArray.push(
                gameData.objectModels.barrier()
            );
        }

        barr = barriersArray[0];
        barr.xPosition = 0;
        barr.yPosition = 0;
        barr.height = gameData.gameSize.height - barr.width;

        barr = barriersArray[1];
        barr.xPosition = barr.height;
        barr.yPosition = 0;
        barr.width = gameData.gameSize.width - barr.height;

        barr = barriersArray[2];
        barr.xPosition = gameData.gameSize.width - barr.width;
        barr.yPosition = barr.width;
        barr.height = gameData.gameSize.height - barr.width;

        barr = barriersArray[3];
        barr.xPosition = 0;
        barr.yPosition = gameData.gameSize.height - barr.height;
        barr.width = gameData.gameSize.width - barr.height;


        gameData.gameObjects.barriers = gameData.gameObjects.barriers.concat(barriersArray);
    },

    afterGoalReset() {

    },

    gameInProgress: false,

    stopGameTicks() {
        this.gameInProgress = false;
    },

    handleGameStep() {
        physicsManager.resolveControls();
        physicsManager.moveThings();
        graphicsManager.drawAllObjects();
        // draw everything
        // compute energies
        // resolve movements
        // resolve situations - goals etc.
    },

    startGameTicks(fps = 45) {
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

//                console.log("animating");

                gameManager.handleGameStep();
            }
        }

    },

};