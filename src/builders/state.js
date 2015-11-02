let DemoView = require('../views/demo');
let World = require('../engine/world');
let Player = require('../engine/player');
let Physics = require('../engine/physics');
let PlayerInput = require('../input/player');
let PlayState = require('../states/play');
let Map = require('../map');

module.exports = {
    playState: function () {
        let playState = new PlayState();
        let map = new Map(5, 5, 100, 100, 100);
        let world = new World(map);

        let player = new Player(450, 300, 0);
        let playerInput = new PlayerInput(player);

        playState.inputs.set('player', playerInput);

        world.player = player;

        let physics = new Physics(map.totalWidth, map.totalHeight);

        physics.addEntity(player);
        physics.map = map;

        world.physics = physics;

        playState.world = world;

        let view = new DemoView(playState);

        playState.view = view;

        return playState;
    }
};
