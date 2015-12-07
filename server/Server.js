let clients = new Map();

let Server = {

    register (socketId, room, name) {
        let player = {
            name: name,
            position: {
                x: 400,
                y: 400,
                z: 400
            }
        };

        clients.set(socketId, player);
        console.log('registering player', player.name, player.position);

        return player;
    },

    players () {
        let result = {};

        for (let [name, player] of clients.entries()) {
            result[name] = player;
        }

        return result;
    },

    updateClient (socketId, position) {
        let client = clients.get(socketId);

        client.position = {
            x: position.x,
            y: position.y,
            z: position.z
        };

        console.log('updating client', cient);
    },

    clientExists (socketId) {
        return clients.has(socketId);
    }
};

export default Server;
