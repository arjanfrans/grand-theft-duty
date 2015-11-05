let debug = require('debug')('game:builders/state');

let WorldView = require('../views/world');
let World = require('../engine/world');
let Player = require('../engine/entities/player');
let Physics = require('../engine/physics');
let PlayerInput = require('../engine/input/player');
let PlayerView = require('../engine/views/player');
let PlayState = require('../states/play');

let _mapLoader = require('../engine/maps/loader');

module.exports = {
    playState: function () {
        let playState = new PlayState();

        // Player
        let player = new Player(475, 475, 900, 32, 32);
        let playerInput = new PlayerInput(player);
        let playerView = new PlayerView(player);

        playState.inputs.set('player', playerInput);

        let player2 = new Player(300, 300, 900, 32, 32);
        let player2View = new PlayerView(player2);

        // World
        let map = _mapLoader.load('level1');
        let world = new World(map);

        world.player = player;

        let physics = new Physics(map.totalWidth, map.totalHeight);

        physics.addEntity(player);
        physics.map = map;

        world.physics = physics;

        playState.world = world;

        let worldView = new WorldView(world);

        worldView.dynamicViews.add(playerView);
        worldView.dynamicViews.add(playerView);

        playState.view = worldView;

        return playState;
    }
};
