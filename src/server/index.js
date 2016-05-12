'use strict';
require('babel-register');

const http = require('http');
const SocketServer = require('socket.io');
const Client = require('./Client');
const debug = require('debug');
const log = debug('game-server:index');
const AssetManager = require('./ServerAssetManager');
const MapParser = require('../core/maps/MapParser').default;
const BulletSystem = require('../core/BulletSystem').default;
const CollisionSystem = require('../core/CollisionSystem').default;
const Match = require('../core/Match').default;
const ServerState = require('./ServerState');
const Game = require('./Game');
const NetworkPlayer = require('../core/entities/NetworkPlayer').default;

const PORT = 3000;
const MAP = 'level2';
const OPTIONS = {
    poolLimit: 200,
    teams: ['american', 'german'],
    cpuCount: 7,
    map: 'level2',
};

const ENGINE_OPTIONS = {
    networkTimestep: 1000 / 22,
    simulationTimestemp: 1000 / 66,
    timerFrequency: 1000 / 250
};

function createGame (options) {
    AssetManager.init();

    const map = MapParser.parse(AssetManager.getMap(options.map));
    const match = new Match(options.teams);
    const state = new ServerState(match, map);

    const collisionSystem = new CollisionSystem(state);
    const bulletSystem = new BulletSystem(state, {
        poolLimit: options.poolLimit || 200
    });

    state.bulletSystem = bulletSystem;
    state.collisionSystem = collisionSystem;

    const game = new Game(state, ENGINE_OPTIONS);

    log('game created');

    return game;
}

function isNameTaken (name, clients) {
    return Array.from(clients.values()).some(client => {
        return client.name === name;
    });
}

function listenToClient (client, game, clients) {
    const { x, y, z } = game.state.map.randomRespawnPosition();

    const player = new NetworkPlayer(x, y, z, 48, 48, 1, 'american');

    player.id = client.id;

    game.addPlayer(player);
    game.network.addClientPlayer(client, player);

    client.emit('onRegister', {
        map: game.state.map.name,
        teams: OPTIONS.teams,
        serverTime: game.localTime,
        ownPlayer: game.network.getPlayerByClient(client).toJSON(),
        players: Array.from(game.players.values()).filter(player => {
            return game.network.getPlayerByClient(client) !== player;
        }).map(player => player.toJSON())
    });

    for (const otherClient of clients.values()) {
        if (otherClient !== client) {
            otherClient.emit('playerJoined', player.toJSON());
        }
    }

    client.on('clientPing', (data) => {
        client.emit(data);
    });

    client.on('input', (data) => {
        game.network.receiveClientInput(client, data.input, data.time, data.seq);
    });

    debug('listening to client', client.id);
}

function start () {
    const server = http.createServer();
    const io = SocketServer(server);
    const clients = new Map();
    const game = createGame(OPTIONS);

    io.on('connection', (socket) => {
        log('client connected', { socketId: socket.id });

        socket.on('register', (data) => {
            if (isNameTaken(data.name, clients)) {
                socket.emit('serverError', {
                    name: 'NameAlreadyInUseError'
                });
            } else {
                const client = new Client(socket, data.name);

                clients.set(socket, client);

                log('client registered', client.toJSON());

                listenToClient(client, game, clients);

                client.on('disconnect', () => {
                    const player = game.network.getPlayerByClient((client));

                    for (const otherClient of clients.values()) {
                        if (otherClient !== client) {
                            otherClient.emit('playerLeft', player.toJSON());
                        }
                    }

                    clients.delete(socket);
                    game.network.removeClientPlayer(client);
                    game.removePlayer(game.network.getPlayerByClient(client));

                    log('client disconnected', client.toJSON());
                });

                client.on('error', (err) => {
                    log('client error', err);
                });
            }
        });
    });

    server.listen(PORT);

    log('server started');

    game.run();

    log('game running');
}

start();
