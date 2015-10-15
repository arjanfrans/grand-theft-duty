let debug = require('debug')('game:states/play');

let State = require('../engine/state');
let DemoView = require('../views/demo');
let World = require('../engine/world');
let Player = require('../engine/player');

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

        this.world = new World();
        this.player = new Player(300, 300);
        this.view = new DemoView(this);
        this.view.init();
    }

    /**
     * Update the state. Logic and views are updated.
     *
     * @param {float} delta - delta time.
     *
     * @returns {void}
     */
    update (delta) {
        this.view.update();
    }
}

module.exports = PlayState;
