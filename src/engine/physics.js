let debug = require('debug')('game:engine/physics');

let Engine = require('matter-js').Engine;
let World = require('matter-js').World;
let Bodies = require('matter-js').Bodies;

let engine = Engine.create({
    render: {
        options: {
            enabled: false
        }
    }
});

class Physics {
    constructor () {
        this.map = null;
    }

    addEntity (entity) {
        World.addBody(engine.world, entity.body);
    }

    update (delta) {
        Engine.update(engine, delta);
        console.log(engine.world);
    }
}

module.exports = Physics;
