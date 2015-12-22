import io from 'socket.io-client';

class NetworkManager {
    constructor () {
        this.socket = null;
        this.errors = [];
        this.connected = false;
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
