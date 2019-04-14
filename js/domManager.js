
const domManager = {

    menuOpened: true,

    gameShown: false,
    
    toggleElementById(element, hideOrShow) {

        const menu = $("#" + element);
        if (hideOrShow !== undefined) {
            return menu.toggle(hideOrShow);
        }
        menu.toggle();
    },

    async loadTemplates() {
        const game = await $.get('../templates/game.html', function (data) {
            var template=Handlebars.compile(data);
            $("#game").html(template());
        }, 'html');
    
        const menu = await $.get('../templates/menu.html', function (data) {
            var template=Handlebars.compile(data);
            $("#menu").html(template());
        }, 'html');
    },

    initializeCanvasSize() {
        // Will fire in the beginning and on window resize

        const canvas = document.getElementById("game-canvas");

        // set correct height/width to canvas
        // save scaling constant - useful for drawing
        const heightScale = (window.innerHeight - gameData.gameSize.verticalWhiteSpace)/gameData.gameSize.height;
        const widthScale = (window.innerWidth - gameData.gameSize.horizontalWhiteSpace)/gameData.gameSize.width;
        const scale = Math.min(heightScale, widthScale);
        canvas.height = scale*gameData.gameSize.height;
        canvas.width = scale*gameData.gameSize.width;
        gameData.gameSize.drawScale = scale;
    }

};