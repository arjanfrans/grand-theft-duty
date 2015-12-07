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

        return player;
    },

    updateClient (socketId, position) {
        let client = clients.get(socketId);

        client.position = {
            x: position.x,
            y: position.y,
            z: position.z
        };

        return client;
    },

    clientExists (socketId) {
        return clients.has(socketId);
    }
};

export default Server;
