'use strict';

function network () {
    const playerClients = new Map();
    const clientPlayers = new Map();

    function addClientPlayer (client, player) {
        playerClients.set(player, client);
        clientPlayers.set(client, player);
    }

    function removeClientPlayer (client) {
        const player = clientPlayers.get(client);

        clientPlayers.delete(client);
        playerClients.delete(player);
    }

    function sendUpdates (state, serverTime) {
        for (const player of state.players.values()) {
            if (playerClients.has(player)) {
                const updates = {
                    serverTime: serverTime,
                    ownPlayer: player.toJSON(),
                    players: Array.from(state.players.values()).filter(p => {
                        return p !== player;
                    })
                };

                playerClients.get(player).emit('onServerUpdate', updates);
            }
        }
    }

    function receiveClientInput (client, input, inputTime, inputSeq) {
        const player = clientPlayers.get(client);

        player.inputs.push({
            inputs: input,
            time: inputTime,
            seq: inputSeq
        });
    }

    return {
        getPlayerByClient (client) {
            return clientPlayers.get(client);
        },
        getClientByPlayer (player) {
            return playerClients.get(player);
        },
        addClientPlayer,
        removeClientPlayer,
        sendUpdates,
        receiveClientInput
    };
}

module.exports = network;
