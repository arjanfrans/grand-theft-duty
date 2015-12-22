import SocketServer from 'socket.io';
import ServerEngine from '../engine/ServerEngine';
import ServerStateBuilder from './ServerStateBuilder';

const io = new SocketServer();
const DEFAULT_ROOM = 'main';

let engine = new ServerEngine();
let options = {
    poolLimit: 200,
    teams: ['american', 'german'],
    map: 'level2'
};

let state = ServerStateBuilder.create(engine, options);

engine.state = state;
engine.run();

io.listen(3000);

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on('disconnect', () => {
        console.log('disconnecting', socket.id);
    });

    socket.on('register', (data) => {
        socket.join(DEFAULT_ROOM);

        io.to(DEFAULT_ROOM).emit('data', {});
    });

    socket.on('error', (error) => {
        console.log(error);
    });
});
