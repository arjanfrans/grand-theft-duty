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

        this.world = new World();
        this.player = new Player(300, 300, 0);

        let playerInput = new PlayerInput(this.player);

        this.inputs.set('player', playerInput);

        this.physics = new Physics();
        this.physics.map = this.world.map;
        this.physics.addEntity(this.player);

        let demoView = new DemoView(this);

        demoView.init();

        this.view = demoView;
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

        this.physics.update(delta);

        this.player.update(delta);

        this._updateView();
    }

    _updateInputs () {
        for (let input of this.inputs.values()) {
            input.update();
        }
    }

    _updateView () {
        this.view.update();
    }
}

module.exports = PlayState;
