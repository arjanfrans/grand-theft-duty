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

import SocketClient from 'socket.io-client';
import Network from './network';
import NetworkState from './NetworkState';
import NetworkInput from './input/NetworkInput';
import NetworkPlayer from '../../core/entities/NetworkPlayer';

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
function createPlayer (state, name, dead = false) {
    const { x, y, z } = state.map.randomRespawnPosition();
    const player = new Player(x, y, z, 48, 48, 1, 'american');
    const playerInput = new PlayerInput(player);

    state.player = player;
    state.inputs.add(playerInput);

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
        const state = new PlayState(match, map);

        createCpuSoldiers(state, options.cpuCount);
        createPlayer(state, options.playerName);

        const collisionSystem = new CollisionSystem(state);
        const bulletSystem = new BulletSystem(state, {
            poolLimit: options.poolLimit || 200
        });

        state.bulletSystem = bulletSystem;
        state.collisionSystem = collisionSystem;
        state.audio = new PlayAudio(state, 'guns', 'background');

        const uiInput = new UiInput(state);

        state.inputs.add(uiInput);

        createViews(state);

        return state;
    },

    createMultiplayer (engine, options) {
        return new Promise((resolve, reject) => {
            const socket = new SocketClient(options.url);

            socket.on('onRegister', (data) => {
                const match = new Match(data.teams);
                const map = MapParser.parse(AssetManager.getMap(data.map));

                const state = new NetworkState(match, map);
                const network = Network(state, socket);

                const collisionSystem = new CollisionSystem(state);
                const bulletSystem = new BulletSystem(state, {
                    poolLimit: options.poolLimit || 200
                });

                state.bulletSystem = bulletSystem;
                state.collisionSystem = collisionSystem;

                state.network = network;

                const { x, y, z } = data.ownPlayer.position;
                const player = new NetworkPlayer(x, y, z, 48, 48, 1, data.ownPlayer.team);

                player.id = data.ownPlayer.id;

                for (const playerData of data.players) {
                    const { x, y, z } = playerData.position;
                    const otherPlayer = new NetworkPlayer(x, y, z, 48, 48, 1, playerData.team);

                    otherPlayer.id = playerData.id;

                    state.addPlayer(otherPlayer, playerData.team);
                }

                const playerInput = new NetworkInput(player, state);

                state.inputs.add(playerInput);
                state.player = player;

                state.addPlayer(player, data.ownPlayer.team);

                const uiInput = new UiInput(state);

                state.inputs.add(uiInput);
                state.audio = new PlayAudio(state, 'guns', 'background');

                createViews(state);

                network.listen();

                resolve(state);
            });

            socket.on('error', (err) => {
                reject(err);
            });

            socket.emit('register', { name: options.playerName });
        });
    }
};

export default PlayBuilder;
