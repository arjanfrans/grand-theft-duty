let debug = require('debug')('game:states/play');

import State from '../engine/state';

/**
 * State of playing the game.
 *
 * @class
 * @extends State
 */
class PlayState extends State {

    /**
     * @constructor
     */
    constructor () {
        super('play');

        this.world = null;
    }

    init () {
        super.init();
    }

    /**
     * Update the state. Logic and views are updated.
     *
     * @param {float} delta - delta time.
     *
     * @returns {void}
     */
    update (delta) {
        this._updateInputs();

        if (this.world) {
            this.world.update(delta);
        }

        this._updateView(delta);
    }

    _updateInputs () {
        for (let input of this.inputs.values()) {
            input.update();
        }
    }

    _updateView (delta) {
        if (this.view) {
            this.view.update(delta);
        }
    }
}

module.exports = PlayState;
