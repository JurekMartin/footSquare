domManager.loadTemplates()
    .then(() => {
        domManager.toggleElementById("menu", true);
        domManager.toggleElementById("game-canvas", false);
        domManager.initializeCanvasSize();
        window.onresize = () => domManager.initializeCanvasSize();
    })

