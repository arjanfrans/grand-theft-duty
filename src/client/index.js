import { BufferAttribute, BufferGeometry, Sphere } from 'three';

global.THREE = {
    BufferGeometry,
    BufferAttribute,
    Sphere
};

const Game = require('./Game');

Game.start();
