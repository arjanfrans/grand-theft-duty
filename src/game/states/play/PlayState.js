let debug = require('debug')('game:engine/states/play/PlayState');

import State from '../../../engine/states/State';

/**
 * State of playing the game.
 *
 * @class
 * @extends State
 */
class PlayState extends State {

    constructor (match, map) {
        super('play');

        this.collisionSystem = null;
        this.bulletSystem = null;
        this.player = null;
        this.map = map;
        this.match = match;

        // FIXME get this out of here
        this.showScores = false;
        this.paused = false;
        this.onPause = null;
    }

    init () {
        super.init();
    }

    get soldiers () {
        return this.match.soldiers;
    }

    pause () {
        if (this.onPause) {
            this.onPause();
        }

        this.paused = true;
    }

    resume () {
        this.paused = false;
    }

    /**
     * Update the state. Logic and views are updated.
     *
     * @param {float} delta - delta time.
     *
     * @returns {void}
     */
    update (delta) {
        super.updateInputs(delta);

        if (this.paused) {
            return;
        }

        super.updateAudio(delta);

        // Relies on previous turn
        if (this.bulletSystem) {
            this.bulletSystem.update(delta);
        }

        for (let soldier of this.soldiers) {
            soldier.update(delta);

            if (soldier.dead) {
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

export default PlayState;
