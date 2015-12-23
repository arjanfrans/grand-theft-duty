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
let clientSoldiers = new Map();

engine.state = state;
engine.run();

io.listen(3000);

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on('disconnect', () => {
        let soldier = clientSoldiers.get(socket.id);

        state.match.removeSoldier(soldier);
        clientSoldiers.delete(socket.id);

        console.log('disconnecting', socket.id);
    });

    socket.on('register', (data) => {
        socket.join(DEFAULT_ROOM, () => {
            console.log('player joined: ', data);
            let soldier = state.addSoldier(data.playerName);

            clientSoldiers.set(socket.id, soldier);

            socket.emit('ready', {
                map: options.map,
                teams: options.teams
            });
        });
    });

    socket.on('ready', () => {
        let soldier = clientSoldiers.get(socket.id);

        io.to(socket.id).emit('respawn', {
            position: soldier.position
        });

        console.log('spawning player', { name: soldier.name, position: soldier.position });
    });

    socket.on('error', (error) => {
        console.log(error.stack);
    });
});
