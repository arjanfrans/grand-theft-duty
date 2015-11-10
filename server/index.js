'use strict';

let SocketServer = require('socket.io');

let io = new SocketServer();

io.listen(8888);

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on('register', (data) => {
        console.log('client registered', data);
    });

    socket.on('update', (data) => {
        try {
            console.log(JSON.parse(data));
        } catch (err) {
            throw err;
        }
    });

    socket.on('error', (error) => {
        console.log(error);
    });
});
