import {PlayState} from './PlayState';
import {ViewBuilder} from './ViewBuilder';

import Match from '../../core/Match';
import {PlayerInput} from './input/PlayerInput';
import {UiInput} from './input/UiInput';
import {Player} from '../../core/entities/Player';

import PlayAudio from './PlayAudio';
import MapParser from '../../core/maps/MapParser';
import AssetManager from '../../engine/AssetManager';

import {Soldier} from '../../core/entities/Soldier';
import CollisionSystem from '../../core/CollisionSystem';
import {BulletSystem} from '../../core/BulletSystem';
import {ComputerInput} from "./input/ComputerInput";

/**
 * Create CPU soldiers.
 *
 * @param {PlayState} state The play state.
 * @param {number} count Number of CPU soldiers.
 *
 * @return {void}
 */
function createCpuSoldiers (state, count) {
    for (let i = 0; i < count; i++) {
        const { x, y, z } = state.map.randomRespawnPosition();
        const soldier = new Soldier(x, y, z, 48, 48, 1, 'american');

        state.addInput(new ComputerInput(soldier));

        state.match.addSoldier(soldier);
    }
}

/**
 * Create the player entity and add it to the play state.
 *
 * @param {PlayState} state The play state.
 * @param {string} name Name of the player.
 *
 * @param dead
 * @return {void}
 */
function createPlayer (engine, state, name, dead = false) {
    const { x, y, z } = state.map.randomRespawnPosition();
    const player = new Player(x, y, z, 48, 48, 1, 'american');
    const playerInput = new PlayerInput(engine.inputSources, player);

    state.player = player;
    state.addInput(playerInput);

    player.kill();

    state.match.addSoldier(player, 'american');
}

/**
 * Create the views for the play state.
 *
 * @param {PlayState} state The play state.
 *
 * @return {void}
 */
function createViews (state) {
    state.addView(ViewBuilder.playView(state));
    state.addView(ViewBuilder.uiView(state));
}

const PlayBuilder = {
    createSingleplayer (engine, options) {
        const map = MapParser.parse(AssetManager.getMap(options.map));
        const match = new Match(options.teams);
        const state = new PlayState(engine, match, map);

        createCpuSoldiers(state, options.cpuCount);
        createPlayer(engine, state, options.playerName);

        state.bulletSystem = new BulletSystem(state, options.poolLimit || 200);

        state.collisionSystem = new CollisionSystem(state);
        state.audio = new PlayAudio(state, 'guns', 'background');

        const uiInput = new UiInput(engine.inputSources, state);

        state.addInput(uiInput);

        createViews(state);

        return state;
    },
};

export default PlayBuilder;
