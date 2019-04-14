const gameData = {

    gameSize: {
        height: 1000,
        width: 2000,
        verticalWhiteSpace: 100,
        horizontalWhiteSpace: 50,
        drawScale: 1,
    },

    gameObjects: {
        balls: [],
        players: [],
        barriers: [],
        goalAreas: []
    },

    objectModels: {

        ball: () => { return {
            xPosition: 0,
            yPosition: 0,
            xEnergy: 0,
            yEnergy: 0,
            weight: 10,
            height: 20,
            width: 20,
            color: "red",
            canMove: true,
            type: "ball",
            solid: true
        }},

        player: () => { return {
            xPosition: 0,
            yPosition: 0,
            xEnergy: 0,
            yEnergy: 0,
            weight: 100,
            height: 100,
            width: 50,
            color: "yellow",
            canMove: true,
            enginePower: 0,
            type: "player",
            upKey: 38, // arrow up
            downKey: 40, // arrow down
            leftKey: 37, //arrow left
            rightKey: 39, //arrow right
            specialKey1: 32, //space
            specialKey2: 17, //right control
            solid: true
        }},

        barrier: () => { return {
            xPosition: 0,
            yPosition: 0,
            // Basic height/width
            // We will probably rewrite only one of the dimension
            weight: 20,
            height: 20,
            width: 0,
            color: "blue",
            canMove: false,
            type: "barrier",
            solid: true
        }},

        goalArea: () => { return {
            xPosition: 0,
            yPosition: 0,
            weight: 0,
            height: 0,
            width: 0,
            color: "green",
            canMove: false,
            type: "goal",
            solid: false
        }}
    }

}