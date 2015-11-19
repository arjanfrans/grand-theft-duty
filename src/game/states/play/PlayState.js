let debug = require('debug')('game:engine/states/play/PlayState');

import State from '../../../engine/states/State';

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
    constructor (engine, world) {
        super('play', engine);

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

        if (this.physicsSystem && entity.options.physics) {
            this.physicsSystem.addEntity(entity);
        }

        if (this.bulletSystem && entity.options.bullets) {
            this.bulletSystem.addEntity(entity);
        }

        if (this.audio && entity.options.audio) {
            this.audio.addEntity(entity);
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

        if (this.physicsSystem) {
            this.physicsSystem.entities.delete(entity);
        }

        if (this.bulletSystem) {
            this.bulletSystem.entities.delete(entity);
        }

        if (this.audio) {
            this.audio.entities.delete(entity);
        }

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
        super.updateInputs(delta);

        super.updateAudio(delta);

        // Relies on previous turn
        if (this.bulletSystem) {
            this.bulletSystem.update(delta);
        }

        if (this.world) {
            this.world.update(delta);
        }

        if (this.physicsSystem) {
            this.physicsSystem.update(delta);
        }
    }
}

export default PlayState;
