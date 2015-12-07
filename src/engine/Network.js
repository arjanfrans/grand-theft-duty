import Config from '../config';
import SocketClient from 'socket.io-client';
import Soldier from './entities/Soldier';

class Network {
    constructor (state) {
        this.state = state;
        this.player = state.player;
        this.match = state.match;
        this.clients = new Map();
        this.socket = null;
    }

    init () {
        this.socket = SocketClient(Config.server);

        this.socket.on('data', (data) => {
            console.log('sdds', data);
            switch (data.command) {
                case 'UPDATE_PLAYERS': {
                    for (let playerName of data.params.players) {
                        let player = data.params.players[playerName];

                        let soldier = clients.get(playerName);
                        let position = player.position;

                        if (soldier) {
                            soldier.position.x = position.x;
                            soldier.position.y = position.y;
                            soldier.position.z = position.z;
                            console.log('update soldier');
                        } else {
                            soldier = new Soldier(position.x, position.y, position.z, 48, 48, 1, 'american');

                            console.log('new soldier');

                            this.match.addSoldier(soldier, soldier.team);
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
        let position = this.player.position;

        this.socket.emit('update', {
            command: 'UPDATE_POSITION',
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

export default Network;
