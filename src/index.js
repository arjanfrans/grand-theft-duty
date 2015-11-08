import three from 'three/three.js';

// three.js must be set up as a global
global.THREE = three;

localStorage.debug = 'game:*';

let debug = require('debug')('game:index');

debug('booting up game...');

let game = require('./game');

game.start();
