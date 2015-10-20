let debug = require('debug')('game:engine/physics');

let Engine = require('matter-js').Engine;
let World = require('matter-js').World;
let Bodies = require('matter-js').Bodies;

let engine = Engine.create({
    render: {
        visible: false,
        options: {
            enabled: false
        }
    }
});

engine.world.gravity.y = 0;
engine.world.gravity.z = 0;
engine.world.bounds.min.x = -Number.Infinity;
engine.world.bounds.min.y = -Number.Infinity;
engine.world.bounds.max.x = Number.Infinity;
engine.world.bounds.max.y = Number.Infinity;

class Physics {
    constructor () {
    }

    addEntity (entity) {
        World.addBody(engine.world, entity.body);
    }

    addEntities (entities) {
        for (let entity of entities) {
            World.addBody(engine.world, entity.body);
        }
    }

    update (delta) {
        Engine.update(engine, delta);
    }
}

module.exports = Physics;
