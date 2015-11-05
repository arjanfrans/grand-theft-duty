localStorage.debug = 'game:*';

let debug = require('debug')('game:index');

debug('booting up game...');

let game = require('./game');

game.start();
