'use strict';

class ServerState {
    constructor (match, map) {
        this.match = match;
        this.map = map;
        this.collisionSystem = null;
        this.bullerSystem = null;
    }

    get soldiers () {
        return this.match.soldiers;
    }

    get players () {
        return this.match.soldiers;
    }

    update (delta) {
        // TODO bullets
        if (this.bulletSystem) {
            this.bulletSystem.update(delta);
        }

        for (let soldier of this.soldiers) {
            soldier.processInput();

            if (this.collisionSystem) {
                this.collisionSystem.update(soldier, delta);
            }

            soldier.update(delta);

            if (soldier.dead) {
                let position = this.map.randomRespawnPosition();

                soldier.respawn(position);
            }
        }
    }
}

module.exports = ServerState;
