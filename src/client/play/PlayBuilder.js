import PlayState from './PlayState';
import ViewBuilder from './ViewBuilder';

import Match from '../../core/Match';
import PlayerInput from './input/PlayerInput';
import UiInput from './input/UiInput';
import ComputerInput from './input/ComputerInput';
import Player from '../../core/entities/Player';

import PlayAudio from './PlayAudio';
import MapParser from '../../core/maps/MapParser';
import AssetManager from '../../engine/AssetManager';

import Soldier from '../../core/entities/Soldier';
import CollisionSystem from '../../core/CollisionSystem';
import BulletSystem from '../../core/BulletSystem';

import NetworkManager from '../multiplayer/NetworkManager';
import MultiplayerState from './MultiplayerState';

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
        let {x, y, z} = state.map.randomRespawnPosition();
        let soldier = new Soldier(x, y, z, 48, 48, 1, 'american');

        state.inputs.add(new ComputerInput(soldier));
        state.match.addSoldier(soldier);
    }
}

/**
 * Create the player entity and add it to the play state.
 *
 * @param {PlayState} state The play state.
 * @param {string} name Name of the player.
 *
 * @return {void}
 */
function createPlayer (state, name) {
    let {x, y, z} = state.map.randomRespawnPosition();
    let player = new Player(x, y, z, 48, 48, 1, 'american');
    let playerInput = new PlayerInput(player);

    state.player = player;
    state.inputs.add(playerInput);
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

let PlayBuilder = {
    createSingleplayer (engine, options) {
        let map = MapParser.parse(AssetManager.getMap(options.map));
        let match = new Match(options.teams);
        let state = new PlayState(match, map);

        createCpuSoldiers(state, options.cpuCount);
        createPlayer(state, options.playerName);

        let collisionSystem = new CollisionSystem(state);
        let bulletSystem = new BulletSystem(state, {
            poolLimit: options.poolLimit || 200
        });

        state.bulletSystem = bulletSystem;
        state.collisionSystem = collisionSystem;
        state.audio = new PlayAudio(state, 'guns', 'background');

        let uiInput = new UiInput(state);

        state.inputs.add(uiInput);

        createViews(state);

        return state;
    },

    createMultiplayer (engine, options) {
        let network = new NetworkManager();

        network.connect('http://' + options.url);
        network.register(options.playerName);

        return network.waitForReady().then((serverState) => {
            let match = new Match(serverState.teams);
            let map = MapParser.parse(AssetManager.getMap(serverState.map));
            let state = new MultiplayerState(match, map);

            createPlayer(state, options.playerName);

            let collisionSystem = new CollisionSystem(state);
            let bulletSystem = new BulletSystem(state, {
                poolLimit: options.poolLimit || 200
            });

            state.bulletSystem = bulletSystem;
            state.collisionSystem = collisionSystem;
            state.audio = new PlayAudio(state, 'guns', 'background');

            let uiInput = new UiInput(state);

            state.inputs.add(uiInput);

            createViews(state);

            return state;
        }).catch((err) => {
            console.error('Error connecting to server');
            console.error(err);
        });
    }
};

export default PlayBuilder;
