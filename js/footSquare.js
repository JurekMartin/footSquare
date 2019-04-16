domManager.loadTemplates()
    .then(() => {
        domManager.toggleElementById("menu", true);
        domManager.toggleElementById("game-canvas", false);
        domManager.initializeCanvasSize();
        window.onresize = () => domManager.initializeCanvasSize();
        // onkeypress does not work for all keys
        window.onkeydown = (e) => gameData.keysDown.find(item => item === e.keyCode) ? null : gameData.keysDown.push(e.keyCode);
        window.onkeyup = (e) => gameData.keysDown = gameData.keysDown.filter(item => item !== e.keyCode);
    })

