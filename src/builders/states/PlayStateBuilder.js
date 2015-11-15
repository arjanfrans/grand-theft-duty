let debug = require('debug')('game:builders/states/PlayStateBuilder');

import PlayRenderView from '../../engine/states/play/PlayRenderView';
import World from '../../engine/logic/play/World';
import PhysicsSystem from '../../engine/logic/play/PhysicsSystem';
import BulletSystem from '../../engine/logic/play/BulletSystem';
import BulletSystemView from '../../engine/views/bullet-system';
import PlayerInput from '../../engine/input/play/PlayerInput';
import PlayerView from '../../engine/views/player';
import MergedBlocksView from '../../engine/views/merged-blocks';
import CharactersView from '../../engine/views/characters';
import StatsRenderView from '../../engine/ui/StatsRenderView';
import PlayState from '../../engine/states/play/PlayState';

import Entities from '../../engine/logic/play/entities';

import MapParser from '../../engine/maps/MapParser';

let _createPlayView = function (state) {
    let world = state.world;

    let playView = new PlayRenderView(world);

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
    create (engine) {
        // World
        let map = MapParser.parse('level1');
        let world = new World(map);

        let state = new PlayState(engine, world);

        // Player
        let player = new Entities.Player(475, 475, 900, 32, 32);

        // Enemies
        let enemies = [
            new Entities.Character(300, 450, 300, 32, 32),
            new Entities.Character(350, 450, 300, 32, 32),
            new Entities.Character(350, 350, 300, 32, 32),
            new Entities.Character(200, 500, 300, 32, 32)
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

        let statsView = new StatsRenderView();

        state.addView(statsView);

        let playerInput = new PlayerInput(world.player);

        state.inputs.add(playerInput);

        return state;
    }
};

export default PlayStateBuilder;
