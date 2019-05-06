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
                    this.handleEnergyLimits(object);
                    object.xDesiredPosition = object.xPosition + object.xEnergy/object.weight;
                    object.yDesiredPosition = object.yPosition + object.yEnergy/object.weight;
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

        // TODO: This is twice here. Move it into a function
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

        // SIMPLE MOVING OBJECTS, REMOVE IN THE END
        objKeys.forEach(key => {
            objects[key].forEach(object => {
                if (object.canMove) {
                    object.xPosition = object.xDesiredPosition;
                    object.yPosition = object.yDesiredPosition;
                }
            })
        })
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
                (
                    // This condition checks if they "collide" on the Y axis. They really collide only if they collide on the X axis as well
                    (object1UpperBoundary > object2UpperBoundary && object1UpperBoundary < object2BottomBoundary) ||
                    (object1BottomBoundary < object2BottomBoundary && object1BottomBoundary > object2UpperBoundary)
                ) ||
                (
                    (object2UpperBoundary > object1UpperBoundary && object2UpperBoundary < object1BottomBoundary) ||
                    (object2BottomBoundary < object1BottomBoundary && object2BottomBoundary > object1UpperBoundary)
                )

            ) &&
            (
                (
                    // X axis "collision" check
                    (object1RightBoundary < object2RightBoundary && object1RightBoundary > object2LeftBoundary) ||
                    (object1LeftBoundary > object2LeftBoundary && object1LeftBoundary < object2RightBoundary)
                ) ||
                (
                    // X axis "collision" check
                    (object2RightBoundary < object1RightBoundary && object2RightBoundary > object1LeftBoundary) ||
                    (object2LeftBoundary > object1LeftBoundary && object2LeftBoundary < object1RightBoundary)
                )
            )
        ) {
            this.distributeCollisionEnergy(object1, object2);
            if (object1.solid && object2.solid) {
                object1.xDesiredPosition = object1.xPosition;
                object2.xDesiredPosition = object2.xPosition;
                object1.yDesiredPosition = object1.yPosition;
                object2.yDesiredPosition = object2.yPosition;
            }

        }
    },

    handleEnergyLimits(object){
        // max speed in any direction is 19.9
        // barrier has depth of 10, ball is 10x10 so that 20+ would
        // allow going through a wall
        const maxEnergyConstant = 19.99;
        object.xEnergy = Math.max(object.weight*maxEnergyConstant*(-1), Math.min(object.xEnergy, object.weight*maxEnergyConstant));
        object.yEnergy = Math.max(object.weight*maxEnergyConstant*(-1), Math.min(object.yEnergy, object.weight*maxEnergyConstant));
    },

    distributeCollisionEnergy(object1, object2) {
        // Two objects collided. We need to tell how they will exchange energies now.
        // Note that we know they collided and can count on that
        // If one of them is solid && not moveabnle, than the other one will just bounce perfectly
        // Otherwise some move serious "physics" will take place
        // Note that because of we compare each pair of objects only once we must check whether
        // obj1 collides with obj2 and if obj2 collides with obj1 at the same time

        // Collision formulas based on https://en.wikipedia.org/wiki/Elastic_collision#One-dimensional_Newtonian


        let object1UpperBoundary, object1LeftBoundary, object1RightBoundary, object1BottomBoundary;
        let object2UpperBoundary, object2LeftBoundary, object2RightBoundary, object2BottomBoundary;
        let object1UpperDesiredBoundary, object1LeftDesiredBoundary, object1RightDesiredBoundary, object1BottomDesiredBoundary;
        let object2UpperDesiredBoundary, object2LeftDesiredBoundary, object2RightDesiredBoundary, object2BottomDesiredBoundary;

        object1UpperDesiredBoundary = object1.yDesiredPosition;
        object1BottomDesiredBoundary = object1.yDesiredPosition + object1.height;
        object1LeftDesiredBoundary = object1.xDesiredPosition;
        object1RightDesiredBoundary = object1.xDesiredPosition + object1.width;

        object2UpperDesiredBoundary = object2.yDesiredPosition;
        object2BottomDesiredBoundary = object2.yDesiredPosition + object2.height;
        object2LeftDesiredBoundary = object2.xDesiredPosition;
        object2RightDesiredBoundary = object2.xDesiredPosition + object2.width;

        object1UpperBoundary = object1.yPosition;
        object1BottomBoundary = object1.yPosition + object1.height;
        object1LeftBoundary = object1.xPosition;
        object1RightBoundary = object1.xPosition + object1.width;

        object2UpperBoundary = object2.yPosition;
        object2BottomBoundary = object2.yPosition + object2.height;
        object2LeftBoundary = object2.xPosition;
        object2RightBoundary = object2.xPosition + object2.width;

        // Like in css - uppper, right, bottom, left
        const collisionDirections = [false, false, false, false];

        // Check left collision
        if (
            (
                object1RightBoundary < object2LeftDesiredBoundary &&
                object1RightDesiredBoundary > object2LeftDesiredBoundary
            ) ||
            (
                object2LeftBoundary > object1RightDesiredBoundary &&
                object2LeftDesiredBoundary < object1RightDesiredBoundary
            )
        ) {
            // collision from left
            collisionDirections[3] = true;
            object1.color = "turquoise";
            object2.color = "turquoise";
        }

        // Check right collision
        if (
            (
                object1LeftBoundary > object2RightDesiredBoundary &&
                object1LeftDesiredBoundary < object2RightDesiredBoundary
            ) ||
            (
                object2RightBoundary < object1LeftDesiredBoundary &&
                object2RightDesiredBoundary > object1LeftDesiredBoundary
            )

        ) {
            // collision from right
            collisionDirections[1] = true;
            object1.color = "yellow";
            object2.color = "yellow";
        }

        // Check upper collision
        if (
            (
                object1BottomBoundary < object2UpperDesiredBoundary &&
                object1BottomDesiredBoundary > object2UpperDesiredBoundary
            ) ||
            (
                object2UpperBoundary > object1BottomDesiredBoundary &&
                object2UpperDesiredBoundary < object1BottomDesiredBoundary
            )

        ) {
            // collision from up
            collisionDirections[0] = true;
            object1.color = "pink";
            object2.color = "pink";
        }

        // Check lower collision
        if (
            (
                object1UpperBoundary > object2BottomDesiredBoundary &&
                object1UpperDesiredBoundary < object2BottomDesiredBoundary
            ) ||
            (
                object2BottomBoundary < object1UpperDesiredBoundary &&
                object2BottomDesiredBoundary > object1UpperDesiredBoundary   
            )

        ) {
            // collision from bottom
            collisionDirections[2] = true;
            object1.color = "black";
            object2.color = "black";
        }

        // If collision between solid objects occured do not move object in this frame
        if (object1.solid && object2.solid && collisionDirections.some(dir => dir)) {
            object1.xDesiredPosition = object1.xPosition;
            object1.yDesiredPosition = object1.yPosition;
            object2.yDesiredPosition = object2.yPosition;
            object2.xDesiredPosition = object2.xPosition;
        }

        // Collision directions now contain info about from which side the collision occured
        if (
            object1.type === "barrier" || object2.type === "barrier"
        ) {
            // Collision with a wall results in simple bouncing

            const obj = object1.type === "barrier" ? object2 : object1;
            if (collisionDirections[0] || collisionDirections[2]) {
                // upper/lower collision
                obj.yEnergy *= -1;
            } else {
                // left/right collision
                obj.xEnergy *= -1;
            }
        } else if (
            object1.solid && object2.solid
        ) {

            if ((collisionDirections[0] || collisionDirections[2]) && !collisionDirections[1] && !collisionDirections[3]) {
                // upper/lower collision
                // v = new velocity, m = weight, u = old velocity
                let v1, m1, u1, v2, m2, u2

                m1 = object1.weight;
                m2 = object2.weight;
                u1 = object1.yEnergy/m1;
                u2 = object2.yEnergy/m2;

                v1 = (m1 - m2)/(m1 + m2)*u1 + 2*m2/(m1 + m2)*u2;
                v2 = (m2 - m1)/(m1 + m2)*u2 + 2*m1/(m1 + m2)*u1;

                object1.yEnergy += (v1 - u1)*object1.weight;
                object2.yEnergy += (v2 - u2)*object2.weight;


                object1.xEnergy = object1.xEnergy - object1.xEnergy*(1-0.5) + object2.xEnergy*0.5;
                object2.xEnergy = object2.xEnergy - object2.xEnergy*(1-0.5) + object1.xEnergy*0.5;
            } else if (!collisionDirections[0] && !collisionDirections[2] && (collisionDirections[1] || collisionDirections[3])){
                // left/right collision
                // v = new velocity, m = weight, u = old velocity
                let v1, m1, u1, v2, m2, u2

                m1 = object1.weight;
                m2 = object2.weight;
                u1 = object1.xEnergy/m1;
                u2 = object2.xEnergy/m2;

                v1 = (m1 - m2)/(m1 + m2)*u1 + 2*m2/(m1 + m2)*u2;
                v2 = (m2 - m1)/(m1 + m2)*u2 + 2*m1/(m1 + m2)*u1;

                object1.xEnergy += (v1 - u1)*object1.weight;
                object2.xEnergy += (v2 - u2)*object2.weight;

                object1.yEnergy = object1.yEnergy - object1.yEnergy*(1-0.5) + object2.yEnergy*0.5;
                object2.yEnergy = object2.yEnergy - object2.yEnergy*(1-0.5) + object1.yEnergy*0.5;
            } else {
                // this is both left/right and upper/lower collision;
                let v1, m1, u1, v2, m2, u2

                m1 = object1.weight;
                m2 = object2.weight;
                u1 = object1.yEnergy/m1;
                u2 = object2.yEnergy/m2;

                v1 = (m1 - m2)/(m1 + m2)*u1 + 2*m2/(m1 + m2)*u2;
                v2 = (m2 - m1)/(m1 + m2)*u2 + 2*m1/(m1 + m2)*u1;

                object1.yEnergy += (v1 - u1)*object1.weight;
                object2.yEnergy += (v2 - u2)*object2.weight;

                m1 = object1.weight;
                m2 = object2.weight;
                u1 = object1.xEnergy/m1;
                u2 = object2.xEnergy/m2;

                v1 = (m1 - m2)/(m1 + m2)*u1 + 2*m2/(m1 + m2)*u2;
                v2 = (m2 - m1)/(m1 + m2)*u2 + 2*m1/(m1 + m2)*u1;

                object1.xEnergy += (v1 - u1)*object1.weight;
                object2.xEnergy += (v2 - u2)*object2.weight;
            }
        }


    }

}