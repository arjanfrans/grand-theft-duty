import Config from '../config';
import SocketClient from 'socket.io-client';
import Soldier from './entities/Soldier';

class Network {
    constructor (state) {
        this.state = state;
        this.match = state.match;
        this.clients = new Map();
        this.socket = null;
        this._player = null;
    }

    set player (player) {
        this._player = player;
        this.clients.set(player.name, player);
    }

    init () {
        this.socket = SocketClient(Config.server);

        this.socket.on('data', (data) => {
            switch (data.command) {
                case 'UPDATE_PLAYERS': {
                    console.log(Array.from(this.clients.keys()));
                    for (let playerName of Object.keys(data.params.players)) {
                        let player = data.params.players[playerName];
                        let soldier = this.clients.get(playerName);

                        let position = player.position;

                        if (soldier !== this._player) {
                            if (soldier) {
                                soldier.position.x = position.x;
                                soldier.position.y = position.y;
                                soldier.position.z = position.z;
                                console.log('update soldier');
                            } else {
                                soldier = new Soldier(position.x, position.y, position.z, 48, 48, 1, 'american');

                                soldier.name = player.name;
                                console.log('new soldier');

                                this.match.addSoldier(soldier, soldier.team);
                                this.clients.set(soldier.name, soldier);
                            }
                        }
                    }
                }
            }
        });
    }

    register (name) {
        this.socket.emit('register', {
            name: name
        });
    }

    update () {
        if (this._player) {
            let position = this._player.position;

            this.socket.emit('update', {
                command: 'UPDATE_PLAYERS',
                params: {
                    position: {
                        x: position.x,
                        y: position.y,
                        z: position.z
                    }
                }
            });
        }
    }
}

export default Network;
