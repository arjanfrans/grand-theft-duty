let debug = require('debug')('game:builders/state');

import PlayStateView from '../engine/states/play/play-view';

import World from '../engine/world';
import Player from '../engine/entities/player';
import Character from '../engine/entities/character';
import PhysicsSystem from '../engine/physics-system';
import BulletSystem from '../engine/bullet-system';
import BulletSystemView from '../engine/views/bullet-system';
import PlayerInput from '../engine/input/play/player';
import PlayerView from '../engine/views/player';
import MergedBlocksView from '../engine/views/merged-blocks';
import CharactersView from '../engine/views/characters';
import UI from '../engine/ui/ui';
import PlayState from '../engine/states/play/play-state';

import MapLoader from '../engine/maps/map-loader';

let _createPlayView = function (state) {
    let world = state.world;

    let playView = new PlayStateView(world);

    // Static views
    let blocksView = new MergedBlocksView(world.map.blocks);

    playView.addStaticView(blocksView);

    // Dynamic Views
    let playerView = new PlayerView(world.player);
    let charactersView = new CharactersView(world.characters);
    let bulletSystemView = new BulletSystemView(state.bulletSystem);

    playView.addDynamicView(playerView);
    playView.addDynamicView(charactersView);
    playView.addDynamicView(bulletSystemView);

    // Camera follow
    playView.cameraFollowView = playerView;

    return playView;
};

let PlayStateBuilder = {
    create () {
        // World
        let map = MapLoader.load('level1');
        let world = new World(map);

        let state = new PlayState(world);

        // Player
        let player = new Player(475, 475, 900, 32, 32);

        // Enemies
        let enemies = [
            new Character(300, 450, 300, 32, 32),
            new Character(350, 450, 300, 32, 32),
            new Character(350, 350, 300, 32, 32),
            new Character(200, 500, 300, 32, 32)
        ];

        // Physics
        let physicsSystem = new PhysicsSystem(map);

        // Bullet system
        let bulletSystem = new BulletSystem();

        state.bulletSystem = bulletSystem;
        state.physicsSystem = physicsSystem;

        state.addEntities(enemies);
        state.addEntity(player);

        let worldView = _createPlayView(state);

        state.addView(worldView);

        let UIView = new UI();

        state.addView(UIView);

        let playerInput = new PlayerInput(world.player);

        state.inputs.add(playerInput);

        return state;
    }
};

export default PlayStateBuilder;
