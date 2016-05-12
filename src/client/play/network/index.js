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

        socket.on('playerJoined', (player) => {
            state.addPlayer(player, player.team);
        });

        socket.on('playerLeft', (player) => {
            state.removePlayerById(player.id);
        });

        socket.on('onServerUpdate', state.onServerUpdate);

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
