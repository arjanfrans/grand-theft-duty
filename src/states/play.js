let debug = require('debug')('game:states/play');

let State = require('../engine/state');
let DemoView = require('../views/demo');

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

        this.view = new DemoView();
    }

    /**
     * Update the state. Logic and views are updated.
     *
     * @returns {void}
     */
    update () {
        this.view.update();
    }
}

module.exports = PlayState;
