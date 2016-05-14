import NetworkPlayer from '../../../core/entities/NetworkPlayer';

function network (state, socket) {
    let previousPing = 0;
    let netPing = 0;
    let netLatency = 0;

    function receivePing (data) {
        netPing = new Date().getTime() - data;
        netLatency = netPing / 2;
    }

    function ping () {
        previousPing = new Date().getTime();
        socket.emit('clientPing', previousPing);
    }

    function listen () {
        socket.on('serverPing', receivePing);

        socket.on('playerJoined', (playerData) => {
            const { x, y, z } = playerData.position;
            const player = new NetworkPlayer(x, y, z, 48, 48, 1, playerData.team);

            player.id = playerData.id;

            state.addPlayer(player, playerData.team);
        });

        socket.on('playerLeft', (player) => {
            state.removePlayerById(player.id);
        });

        socket.on('onServerUpdate', (data) => {
            state.onServerUpdate(data);
        });

        socket.on('error', (err) => {
            console.error('network error', err);
        });

        return socket;
    }

    return {
        listen,
        ping,

        get netPing () {
            return netPing;
        },

        get netLatency () {
            return netLatency;
        },

        emit (eventName, data) {
            socket.emit(eventName, data);
        }
    };
}

export default network;
