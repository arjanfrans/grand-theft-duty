import World from '../../game/logic/play/World';

import PlayState from '../../game/states/play/PlayState';
import PlayRenderView from '../../game/states/play/PlayRenderView';

import Systems from '../../engine/Systems';
import Views from '../../engine/views';

import PlayerInput from '../../game/input/play/PlayerInput';
import UiInput from '../../game/input/play/UiInput';
import ComputerInput from '../../game/input/play/ComputerInput';
import Player from '../../game/logic/play/entities/Player';
import PlayerView from '../../game/views/PlayerView';

import PlayAudio from '../../game/audio/PlayAudio';

import CharactersView from '../../game/views/characters';
import BulletView from '../../game/views/BulletView';

import Stats from '../../game/logic/play/Stats';
import StatsRenderView from '../../game/ui/StatsRenderView';

import Entities from '../../engine/entities';

import MapParser from '../../engine/maps/MapParser';

let _createPlayView = function (state) {
    let world = state.world;

    let playView = new PlayRenderView(world);

    // Static views
    let blocksView = new Views.StaticBlocks(world.map, 'tiles');

    playView.addStaticView(blocksView);

    // Dynamic Views
    let playerView = new PlayerView(world.player);
    let charactersView = new CharactersView(world.characters);
    let bulletSystemView = new Views.BulletSystem(state.bulletSystem, BulletView);
    let waterView = new Views.WaterBlocks(world.map, 'tiles');

    playView.addDynamicView(playerView);
    playView.addDynamicView(charactersView);
    playView.addDynamicView(bulletSystemView);
    playView.addDynamicView(waterView);

    // Camera follow
    playView.cameraFollowView = playerView;

    return playView;
};

let _createEntities = function (state) {
    let entities = [];
    let player = new Player(350, 350, 900, 48, 48, 1, 'american');

    // Player
    entities.push(player);

    let playerInput = new PlayerInput(player);

    state.inputs.add(playerInput);

    let enemy = new Entities.Soldier(350, 450, 900, 48, 48, 1, 'german');

    entities.push(enemy);

    enemy.currentWeapon.ammo = 999;

    state.inputs.add(new ComputerInput(enemy));

    // Enemies
    return entities.concat([
        new Entities.Soldier(350, 650, 300, 48, 48, 1, 'german'),
        new Entities.Soldier(550, 550, 300, 48, 48, 1, 'german')
    ]);
};

let PlayStateBuilder = {
    create (engine) {
        // World
        let map = MapParser.parse('level2');
        let world = new World(map);

        world.teams = ['german', 'american'];

        let state = new PlayState(engine, world);

        // Physics
        let collisionSystem = new Systems.Collision(map, {
            wallCollision: true,
            floorCollision: true
        });

        // Bullet system
        let bulletSystem = new Systems.Bullet(map);

        state.bulletSystem = bulletSystem;
        state.collisionSystem = collisionSystem;
        state.audio = new PlayAudio(state, 'guns', 'background');

        let entities = _createEntities(state);

        state.addEntities(entities);

        let worldView = _createPlayView(state);

        state.addView(worldView);

        let stats = new Stats(state);
        let statsView = new StatsRenderView(stats);

        state.stats = stats;

        state.addView(statsView);

        let uiInput = new UiInput(stats);

        state.inputs.add(uiInput);

        return state;
    }
};

export default PlayStateBuilder;
