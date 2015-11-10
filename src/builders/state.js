let debug = require('debug')('game:builders/state');

import WorldView from '../views/world';
import World from '../engine/world';
import Player from '../engine/entities/player';
import Physics from '../engine/physics';
import BulletSystem from '../engine/bullet-system';
import BulletSystemView from '../engine/views/bullet-system';
import PlayerInput from '../engine/input/player';
import PlayerView from '../engine/views/player';
import PlayState from '../states/play';
import Network from '../network';

import MapLoader from '../engine/maps/map-loader';

module.exports = {
    playState: function () {
        let playState = new PlayState();

        // Player
        let player = new Player(475, 475, 900, 32, 32);
        let playerInput = new PlayerInput(player);
        let playerView = new PlayerView(player);

        playState.inputs.set('player', playerInput);

        let player2 = new Player(300, 500, 300, 32, 32);
        let player2View = new PlayerView(player2);

        // World
        let map = MapLoader.load('level1');
        let world = new World(map);

        world.player = player;

        let worldView = new WorldView(world);

        let physics = new Physics(map.totalWidth, map.totalHeight);

        physics.addEntity(player);
        physics.addEntity(player2);
        physics.map = map;

        world.physics = physics;

        // Bullet system
        let bulletSystem = new BulletSystem();

        bulletSystem.addEntity(player);
        bulletSystem.addEntity(player2);

        world.bulletSystem = bulletSystem;

        let bulletSystemView = new BulletSystemView(bulletSystem);

        worldView.dynamicViews.add(bulletSystemView);
        worldView.dynamicViews.add(playerView);
        worldView.dynamicViews.add(player2View);

        playState.world = world;
        playState.view = worldView;

        return playState;
    }
};
