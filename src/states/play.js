let debug = require('debug')('game:states/play');

let State = require('../engine/state');
let DemoView = require('../views/demo');
let World = require('../engine/world');
let Player = require('../engine/player');
let Physics = require('../engine/physics');
let PlayerInput = require('../input/player');

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
        this.player = null;
        this.physics = null;
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

        if (this.physics) {
            this.physics.update(delta);
        }

        if (this.world) {
            this.world.update(delta);
        }

        this._updateView();
    }

    _updateInputs () {
        for (let input of this.inputs.values()) {
            input.update();
        }
    }

    _updateView () {
        if (this.view) {
            this.view.update();
        }
    }
}

module.exports = PlayState;
