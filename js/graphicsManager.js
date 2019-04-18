const graphicsManager = {

    drawOnCanvas(x, y, width, height, color = "white") {
        const canvas = document.getElementById("game-canvas");
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
    },

    clearGameCanvas() {
        const canvas = document.getElementById("game-canvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, gameData.gameSize.width, gameData.gameSize.height);
    },

    drawAllObjects() {
        this.clearGameCanvas();
        const objects = gameData.gameObjects;
        const scale = gameData.gameSize.drawScale;
        const orderedObjectsKeys = gameData.orderedObjectsKeys;
        
        orderedObjectsKeys.forEach(key => {
            objects[key].forEach(object => {
                this.drawOnCanvas(object.xPosition*scale, object.yPosition*scale, object.width*scale, object.height*scale, object.color);
            })
        })
    }
}