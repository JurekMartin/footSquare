const gameData = {

    gameSize: {
        height: 1000,
        width: 2000,
        verticalWhiteSpace: 100,
        horizontalWhiteSpace: 50,
        drawScale: 1,
    },

    gameObjects: {
        // NOTE: this will be reset by resetGameObjects function
        balls: [],
        players: [],
        barriers: [],
        goalAreas: [],
        // We need to manually set the order so that we e.g. draw goalAreas first and players on them, not vice versa
        orderedObjectsKeys: ["goalAreas", "balls", "players", "barriers"]
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
            controls: {
                up: 38, // arrow up
                down: 40, // arrow down
                left: 37, //arrow left
                right: 39, //arrow right
                special1: 32, //space
                special2: 17, //right control
            },
            solid: true
        }},

        barrier: () => { return {
            xPosition: 0,
            yPosition: 0,
            // Basic height/width
            // We will probably rewrite only one of the dimension
            weight: 20,
            height: 20,
            width: 20,
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
    },

    keyNumbers: {
        left:37,
        right:39,
        up:38,
        down:40,
        w:87,
        a:65,
        s:83,
        d:68,
        num4:100,
        num6:102,
        num8:104,
        num5:101,
        j:74,
        k:75,
        l:76,
        i:73,
        enter:13
    },

    keysDown: []

}