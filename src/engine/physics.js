let debug = require('debug')('game:engine/physics');

class Physics {
    constructor () {
        this.map = null;
        this.entities = new Set();
    }

    addEntity (entity) {
        this.entities.add(entity);
    }

    update (delta) {
        for (let entity of this.entities) {
            if (entity.collidable) {
                let start = {
                    x: entity.position.x,
                    y: entity.position.y,
                    z: entity.position.z
                };

                let end = {
                    x: entity.position.x,
                    y: entity.position.y,
                    z: entity.position.z
                };

                let nextEntityPosition = {
                    x: entity.position.x + entity.velocity.x * delta,
                    y: entity.position.y + entity.velocity.y * delta,
                    z: entity.position.z + entity.velocity.z * delta
                };

                let nextAngle = entity.angleRadian + (entity.angularVelocity * delta);
                let nextAngleDegree = entity.angleRadian / (Math.PI / 180) % 360;
                let tileWidth = this.map.tileWidth;
                let tileHeight = this.map.tileHeight;

                // Facing north
                if (nextAngleDegree < 315 && nextAngleDegree >= 225) {
                    // start.x = start.x - tileWidth;
                    end.x = nextEntityPosition.x + tileWidth;
                    end.y = nextEntityPosition.y + tileHeight;
                } else if (nextAngleDegree < 225 && nextAngleDegree >= 115) {
                    // Facing east
                    start.y = start.y + tileHeight;
                    end.x = nextEntityPosition.x + tileWidth;
                    end.y = nextEntityPosition.y - tileHeight;
                } else if (nextAngleDegree < 115 && nextAngleDegree >= 45) {
                    // Facing south
                    start.x = start.x - tileWidth;
                    end.x = nextEntityPosition.x + tileWidth;
                    end.y = nextEntityPosition.y - tileHeight;
                } else if (nextAngleDegree < 45 || nextAngleDegree > 315) {
                    // Facing west
                    start.y = start.y + tileHeight;
                    end.x = nextEntityPosition.x - tileWidth;
                    end.y = nextEntityPosition.y - tileHeight;
                } else {
                    debug('invalid angle', { nextAngleDegree });
                }

                let blocks = this.map.blocksBetweenPositions(nextEntityPosition, end);

                if (blocks.length > 0) {
                    debug('colliding blocks', { angle: nextAngleDegree, blocks: blocks});
                }
            }
        }
    }
}

module.exports = Physics;
