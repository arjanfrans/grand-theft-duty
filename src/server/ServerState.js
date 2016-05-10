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

    update (delta) {
        // TODO bullets
        // if (this.bulletSystem) {
            // this.bulletSystem.update(delta);
        // }

        for (let soldier of this.soldiers) {
            soldier.update(delta);
            //
            // if (soldier.dead) {
            //     let position = this.map.randomRespawnPosition();
            //
            //     soldier.respawn(position);
            // }
        }

        // for (const player of this.players) {
        //     player.old_state.pos = Vector.copy(player.pos);
        //
        //     const newDir = processInput(player, delta);
        //
        //     player.pos = Vector.add(player.old_state.pos, newDir);
        //
        //     player.inputs = [];
        //
        //     this._collisionHandler.process(player);
        // }
        //
        if (this.collisionSystem) {
            this.collisionSystem.update(delta);
        }
    }
}

module.exports = ServerState;
