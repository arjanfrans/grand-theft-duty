// setup debug module
localStorage.debug = 'game:*';

let debug = require('debug')('game:index');

debug('booting up game...');

let playState = require('./states/play');

playState.init();
