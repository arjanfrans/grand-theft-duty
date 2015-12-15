import three from 'three/three.js';

// three.js must be set up as a global
global.THREE = three;

let Game = require('./Game');

Game.start();
