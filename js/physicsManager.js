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

            // Note that we first fire the engine and apply friction on
            // the new energy in the same frame
            up ? player.yEnergy -= player.enginePower : null;
            down ? player.yEnergy += player.enginePower : null;
            left ? player.xEnergy -= player.enginePower : null;
            right ? player.xEnergy += player.enginePower : null;
        })
    },

    moveThings() {
        // See where solid moveable things want to go based on their energy levels
        // determine which will colide
        // IF at least two objects are going to collide then
        // we should let them exchange their energies in this frame
        // they will not move in this frame

        const objects = gameData.gameObjects;
        const objKeys = Object.keys(objects);

        objKeys.forEach(key => {
            objects[key].forEach(object => {
                if (object.canMove) {
                    object.xEnergy *=(1- object.friction);
                    object.yEnergy *=(1- object.friction);

                    object.xDesiredPosition = object.xPosition + object.xEnergy/object.weight;
                    object.yDesiredPosition = object.yPosition + object.yEnergy/object.weight;

                    // REMOVE IN THE END
                    object.xPosition = object.xDesiredPosition;
                    object.yPosition = object.yDesiredPosition;
                } else {
                    object.xDesiredPosition = object.xPosition;
                    object.yDesiredPosition = object.yPosition;
                }

            })
        })

        // Now every object that CAN move has x and y desiredPosition
        // no need to have this for unmoveable objects
        // Now we need to see what objects are going to collide

        // What if an object should collide with multiple objects at once?
        // then we need to resolve the collisions in some sensible order
        // If we resolve collisions of all objects with other objects only once
        // then we will get the desired behaviout... probably :)
        

        // this will be come crazy iterating here...
        for (let i = 0; i < objKeys.length; i++) {
            for (let y = 0; y < objects[objKeys[i]].length; y++) {
                const evaluatedObject = objects[objKeys[i]][y];
                let ii = i;
                let yy = y;


                for (ii; ii < objKeys.length; ii++) {
                    // need to declare yyy because yy would not turn 0 after it was 1
                    // so we would not iterate through full arrays anymore
                    for (let yyy = 0; yyy < objects[objKeys[ii]].length; yyy++) {
                        // WE HAVE evaluateObject and now we compare it to
                        // every other object after it in the objects arrays
                        // this way we know that each pair of objects will evaluate
                        // only once

                        if (ii === i && yyy <= yy) {
                        } else {
                            this.resolveCollisionsOfSolidObjects(evaluatedObject, objects[objKeys[ii]][yyy]);
                        }

                    }
                }
            }
        }
    },

    resolveCollisionsOfSolidObjects(object1, object2) {

        // Both objects have their x and y desiredPosition declared from moveThings

        let object1UpperBoundary, object1LeftBoundary, object1RightBoundary, object1BottomBoundary;
        let object2UpperBoundary, object2LeftBoundary, object2RightBoundary, object2BottomBoundary;

        object1UpperBoundary = object1.yDesiredPosition;
        object1BottomBoundary = object1.yDesiredPosition + object1.height;
        object1LeftBoundary = object1.xDesiredPosition;
        object1RightBoundary = object1.xDesiredPosition + object1.width;

        object2UpperBoundary = object2.yDesiredPosition;
        object2BottomBoundary = object2.yDesiredPosition + object2.height;
        object2LeftBoundary = object2.xDesiredPosition;
        object2RightBoundary = object2.xDesiredPosition + object2.width;

        // DO THEY COLLIDE?

        if (
            (
                // This condition checks if they "collide" on the Y axis. They really collide only if they collide on the X axis as well
                (object1UpperBoundary > object2UpperBoundary && object1UpperBoundary < object2BottomBoundary) ||
                (object1BottomBoundary < object2BottomBoundary && object1BottomBoundary > object2UpperBoundary)
            ) &&
            (
                // X axis "collision" check
                (object1RightBoundary < object2RightBoundary && object1RightBoundary > object2LeftBoundary) ||
                (object1LeftBoundary > object2LeftBoundary && object1LeftBoundary < object2RightBoundary)
            )
        ) {
            console.log("object1 object2 collision:", object1, object2)
            object1.color = "yellow";
            object2.color = "orange";
        }
    },

    distributeCollisionEnergy() {

    }

}