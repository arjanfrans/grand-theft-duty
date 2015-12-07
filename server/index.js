import Config from './config';
import SocketServer from 'socket.io';
import Server from './Server';
import Errors from './Errors';
import Commands from './commands';

const io = new SocketServer();
const DEFAULT_ROOM = 'main';

io.listen(Config.port);

let errorResponse = function (socketId, error) {
    io.to(socketId).emit('data', {
        error: error
    });
};

let updateHandler = function (command, params) {
    let responseData = {};

    switch (command) {
        case 'UPDATE_PLAYERS': {
            let players = Server.players();

            responseData = {
                command: 'UPDATE_PLAYERS',
                params: {
                    players: players
                }
            };

            break;
        }
    }

    io.to(DEFAULT_ROOM).emit('data', responseData);
};

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on('disconnect', () => {
        console.log('disconnecting', socket.id);

        Server.removeClient(socket.id);
    });

    socket.on('register', (data) => {
        if (!data.name) {
            errorResponse(socket.id, Errors.NO_NAME);
        } else {
            socket.join(DEFAULT_ROOM);

            let player = Server.register(socket.id, DEFAULT_ROOM, data.name);

            io.to(DEFAULT_ROOM).emit('data', {
                command: Commands.Client.PLAYER_JOINED,
                params: {
                    player: player
                }
            });
        }
    });

    socket.on('update', (data) => {
        if (Server.clientExists(socket.id)) {
            updateHandler(data.command, data.params);
        } else {
            errorResponse(socket.id, Errors.NOT_REGISTERED);
        }
    });

    socket.on('error', (error) => {
        console.log(error);
    });
});
