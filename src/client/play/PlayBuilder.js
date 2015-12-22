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
 * @param {PlayState} playState The play playState.
 * @param {number} count Number of CPU soldiers.
 *
 * @return {void}
 */
function createCpuSoldiers (playState, count) {
    for (let i = 0; i < count; i++) {
        let {x, y, z} = playState.map.randomRespawnPosition();
        let soldier = new Soldier(x, y, z, 48, 48, 1, 'american');

        playState.inputs.add(new ComputerInput(soldier));
        playState.match.addSoldier(soldier);
    }
}

/**
 * Create the player entity and add it to the play state.
 *
 * @param {PlayState} playState The play state.
 * @param {string} name Name of the player.
 *
 * @return {void}
 */
function createPlayer (playState, name) {
    let {x, y, z} = playState.map.randomRespawnPosition();
    let player = new Player(x, y, z, 48, 48, 1, 'american');
    let playerInput = new PlayerInput(player);

    playState.player = player;
    playState.inputs.add(playerInput);
    playState.match.addSoldier(player, 'american');
}

/**
 * Create the views for the play state.
 *
 * @param {PlayState} playState The play state.
 *
 * @return {void}
 */
function createViews (playState) {
    playState.addView(ViewBuilder.playView(playState));
    playState.addView(ViewBuilder.uiView(playState));
}

let PlayBuilder = {
    createSingleplayer (engine, options) {
        let map = MapParser.parse(AssetManager.getMap(options.map));
        let match = new Match(options.teams);
        let playState = new PlayState(match, map);

        createCpuSoldiers(playState, options.cpuCount);
        createPlayer(playState, options.playerName);

        let collisionSystem = new CollisionSystem(playState);
        let bulletSystem = new BulletSystem(playState, {
            poolLimit: options.poolLimit || 200
        });

        playState.bulletSystem = bulletSystem;
        playState.collisionSystem = collisionSystem;
        playState.audio = new PlayAudio(playState, 'guns', 'background');

        let uiInput = new UiInput(playState);

        playState.inputs.add(uiInput);

        createViews(playState);

        return playState;
    },

    createMultiplayer (engine, options) {
        let network = new NetworkManager();

        network.connect('http://' + options.url);

        return network.waitForReady().then((serverState) => {
            // TODO create local state based on serverState
            // let multiplayerState = new MultiplayerState();
            //
            // return multiplayerState;
            return null;
        });
    }
};

export default PlayBuilder;
