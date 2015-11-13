let debug = require('debug')('game:engine/states/play/play-state');

import State from '../state';

/**
 * State of playing the game.
 *
 * @class
 * @extends State
 */
class PlayState extends State {

    /**
     * @constructor
     * @param {object} world The game world
     */
    constructor (world) {
        super('play');

        this.world = world;
        this.physicsSystem = null;
        this.bulletSystem = null;
    }

    init () {
        super.init();
    }

    addEntity (entity) {
        if (entity.options.isPlayer) {
            this.world.player = entity;
        } else if (entity.options.isCharacter) {
            this.world.characters.add(entity);
        }

        if (entity.options.physics) {
            this.physicsSystem.addEntity(entity);
        }

        if (entity.options.bullets) {
            this.bulletSystem.addEntity(entity);
        }

        this.world.entities.add(entity);
    }

    addEntities (entities) {
        for (let entity of entities) {
            this.addEntity(entity);
        }
    }

    removeEntity (entity) {
        if (this.world.player === entity) {
            this.world.player = null;
        }

        this.physicsSystem.entities.delete(entity);
        this.bulletSystem.entities.delete(entity);
        this.world.entities.delete(entity);
        this.world.characters.delete(entity);
        this.world.enemies.delete(entity);
    }

    removeEntities (entities) {
        for (let entity of entities) {
            this.removeEntity(entity);
        }
    }

    /**
     * Update the state. Logic and views are updated.
     *
     * @param {float} delta - delta time.
     *
     * @returns {void}
     */
    update (delta) {
        super.updateInputs();

        if (this.bulletSystem) {
            this.bulletSystem.update(delta);
        }

        if (this.world) {
            this.world.update(delta);
        }

        if (this.physicsSystem) {
            this.physicsSystem.update(delta);
        }

        super.updateView(delta);
    }
}

module.exports = PlayState;
