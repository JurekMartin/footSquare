const gameManager = {
    
    drawOnCanvas() {
        const canvas = document.getElementById("game-canvas");
        const ctx = canvas.getContext("2d");
        ctx.rect(20, 20, 150, 100);
        ctx.stroke();
    }


};

export {gameManager};