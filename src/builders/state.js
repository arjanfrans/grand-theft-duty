let DemoView = require('../views/demo');
let World = require('../engine/world');
let Player = require('../engine/player');
let Physics = require('../engine/physics');
let PlayerInput = require('../input/player');
let PlayState = require('../states/play');

let PhysicsEngine = require('matter-js').Engine;

module.exports = {
    playState: function () {
        let playState = new PlayState();
        let world = new World();

        let player = new Player(300, 300, 0);
        let playerInput = new PlayerInput(player);

        playState.inputs.set('player', playerInput);

        world.player = player;

        let physics = new Physics();

        physics.addEntity(player);
        playState.physics = physics;

        playState.world = world;

        let view = new DemoView(playState);

        playState.view = view;

        return playState;
    }
};
