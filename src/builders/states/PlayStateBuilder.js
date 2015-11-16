let debug = require('debug')('game:builders/states/PlayStateBuilder');

import World from '../../game/logic/play/World';

import PlayState from '../../game/states/play/PlayState';
import PlayRenderView from '../../game/states/play/PlayRenderView';

import PhysicsSystem from '../../game/logic/play/PhysicsSystem';
import BulletSystem from '../../game/logic/play/BulletSystem';
import BulletSystemView from '../../game/views/bullet-system';

import PlayerInput from '../../game/input/play/PlayerInput';
import PlayerView from '../../game/views/player';

import PlayAudio from '../../game/audio/PlayAudio';

import StaticBlocksView from '../../engine/views/StaticBlocksView';

import CharactersView from '../../game/views/characters';

import StatsRenderView from '../../game/ui/StatsRenderView';

import Entities from '../../game/logic/play/entities';

import MapParser from '../../engine/maps/MapParser';

let _createPlayView = function (state) {
    let world = state.world;

    let playView = new PlayRenderView(world);

    // Static views
    let blocksView = new StaticBlocksView(world.map.blocks, 'tiles');

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

let _createEntities = function () {
    let entities = [];

    // Player
    entities.push(new Entities.Player(475, 475, 900, 32, 32));

    // Enemies
    return entities.concat([
        new Entities.Character(300, 450, 300, 32, 32),
        new Entities.Character(350, 450, 300, 32, 32),
        new Entities.Character(350, 350, 300, 32, 32),
        new Entities.Character(200, 500, 300, 32, 32)
    ]);
};

let PlayStateBuilder = {
    create (engine) {
        // World
        let map = MapParser.parse('level1');
        let world = new World(map);

        let state = new PlayState(engine, world);

        // Physics
        let physicsSystem = new PhysicsSystem(map);

        // Bullet system
        let bulletSystem = new BulletSystem();

        state.bulletSystem = bulletSystem;
        state.physicsSystem = physicsSystem;
        state.audio = new PlayAudio('guns', 'background');

        state.addEntities(_createEntities());

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
