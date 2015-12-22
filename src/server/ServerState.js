class ServerState {
    constructor (match, map) {
        this.collisionSystem = null;
        this.bulletSystem = null;
        this.map = map;
        this.match = match;
    }

    get soldiers () {
        return this.match.soldiers;
    }

    update (delta) {
        // TODO listen for new client messages

        // Relies on previous turn
        if (this.bulletSystem) {
            this.bulletSystem.update(delta);
        }

        for (let soldier of this.soldiers) {
            soldier.update(delta);

            if (soldier.dead) {
                // TODO remove this from the clientside state
                let position = this.map.randomRespawnPosition();

                soldier.respawn(position);
            }
        }

        this.match.update(delta);

        if (this.collisionSystem) {
            this.collisionSystem.update(delta);
        }
    }
}

export default ServerState;
