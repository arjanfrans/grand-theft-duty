import io from 'socket.io-client';

class NetworkManager {
    constructor () {
        this.socket = null;
        this.errors = [];
        this.connected = false;

        this.netLatency = 0.001;
        this.netPing = 0.001;
        this.previousNetPing = 0.001;
        this.netOffset = 100;
        this.localTime = 0.01;
        this.serverTime = 0.01;

        // Recent server updates to interpolate across.
        // This is the buffer that is the driving factor for our networking.
        this.server_updates = [];
    }

    connect (url) {
        this.socket = io(url);

        this.socket.on('connect', () => {
            this.connected = true;

            console.log('Connected to server');
        });

        this.socket.on('error', (err) => {
            console.error('Error from server');
            this.errors.push(err);
        });

        this.socket.on('disconnect', () => {
            console.error('Server disconnected');
            this.connected = false;
        });
    }

    emit (command, data) {
        this.socket.emit(command, data);
    }

    register (playerName) {
        this.socket.emit('register', {
            playerName: playerName
        });
    }

    startListening () {
        this.socket.emit('ready', {});
    }

    waitForReady () {
        return new Promise((resolve, reject) => {
            this.socket.on('ready', (serverState) => {
                return resolve(serverState);
            });

            this.socket.on('connect_error', (err) => {
                return reject(err);
            });
        });
    }
}

export default NetworkManager;
