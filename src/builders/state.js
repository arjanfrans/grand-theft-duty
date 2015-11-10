let debug = require('debug')('game:builders/state');

import WorldView from '../views/world';
import World from '../engine/world';
import Player from '../engine/entities/player';
import Character from '../engine/entities/character';
import Physics from '../engine/physics';
import BulletSystem from '../engine/bullet-system';
import BulletSystemView from '../engine/views/bullet-system';
import PlayerInput from '../engine/input/player';
import PlayerView from '../engine/views/player';
import EnemiesView from '../engine/views/enemies';
import PlayState from '../states/play';

import MapLoader from '../engine/maps/map-loader';

module.exports = {
    playState: function () {
        let playState = new PlayState();

        // Player
        let player = new Player(475, 475, 900, 32, 32);
        let playerInput = new PlayerInput(player);
        let playerView = new PlayerView(player);

        playState.inputs.set('player', playerInput);

        // World
        let map = MapLoader.load('level1');
        let world = new World(map);

        world.player = player;

        let worldView = new WorldView(world);

        // Physics
        let physics = new Physics(map.totalWidth, map.totalHeight);

        physics.addEntity(player);
        physics.map = map;

        world.physics = physics;

        // Enemies
        let enemies = [
            new Character(300, 450, 300, 32, 32),
            new Character(350, 450, 300, 32, 32),
            new Character(350, 350, 300, 32, 32),
            new Character(200, 500, 300, 32, 32)
        ];

        world.enemies = enemies;

        let enemiesView = new EnemiesView(enemies);

        // Bullet system
        let bulletSystem = new BulletSystem();

        bulletSystem.addEntity(player);

        world.bulletSystem = bulletSystem;

        enemies.forEach((enemy) => {
            physics.addEntity(enemy);
            bulletSystem.addEntity(enemy);
        });

        let bulletSystemView = new BulletSystemView(bulletSystem);

        worldView.dynamicViews.add(bulletSystemView);
        worldView.dynamicViews.add(playerView);
        worldView.dynamicViews.add(enemiesView);

        playState.world = world;
        playState.view = worldView;

        return playState;
    }
};
