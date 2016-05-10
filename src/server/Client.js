'use strict';

const md5 = require('md5');

class Client {
    constructor (socket, name) {
        this.id = md5(name);
        this.name = name;
        this.socket = socket;
    }

    emit (event, data) {
        this.socket.emit(event, data);
    }

    on (event, listener) {
        this.socket.on(event, listener);
    }

    send (message) {
        this.socket.send(message);
    }

    toJSON () {
        return {
            id: this.id,
            name: this.name
        };
    }
}

module.exports = Client;
