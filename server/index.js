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
        case 'UPDATE_POSITION': {
            let player = Server.updateClient(socketId, params.position);

            responseData.params = {
                command: 'UPDATE_POSITION',
                player: player
            };

            break;
        }
    }

    io.to(DEFAULT_ROOM, responseData);
};

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

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
        if (clientExists) {
            updateHandler(data.command, data.params);
        } else {
            errorResponse(socketId, Errors.NOT_REGISTERED);
        }
    });

    socket.on('error', (error) => {
        console.log(error);
    });
});
