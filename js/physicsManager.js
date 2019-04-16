const physicsManager = {

    resolveControls() {
        // Expect that only players can have controls
        // might be changed in the future

        const players = gameData.gameObjects.players;
        players.forEach(player => {
            const controls = player.controls;
            const up = gameData.keysDown.some(key => key === controls.up);
            const down = gameData.keysDown.some(key => key === controls.down);
            const left = gameData.keysDown.some(key => key === controls.left);
            const right = gameData.keysDown.some(key => key === controls.right);

            // not implemented yet
            const special1 = gameData.keysDown.some(key => key === controls.special1);
            const special2 = gameData.keysDown.some(key => key === controls.special2);

            // TODO: incorporate energy etc.
            up ? player.yPosition -= 5 : null;
            down ? player.yPosition += 5 : null;
            left ? player.xPosition -= 5 : null;
            right ? player.xPosition += 5 : null;
        })
    },

}