let debug = require('debug')('game:engine/physics');

let _calculateRayPosition = function (entity) {
    let rayDistance = 100;

    let x = entity.position.x;
    let y = entity.position.y;
    let angle = entity.angle;

    let reverse = entity.reverse ? -1 : 1;

    if (Math.abs(entity.velocity.x) > 0) {
        x -= rayDistance * Math.cos(angle) * reverse;
    }

    if (Math.abs(entity.velocity.y) > 0) {
        y -= rayDistance * Math.sin(angle) * reverse;
    }

    return { x: x, y: y, z: entity.position.z };
};
let inBlock = false;

class Physics {
    constructor () {
        this.entities = new Set();
        this.map = null;
    }

    addEntity (entity) {
        this.entities.add(entity);
    }

    update (delta) {
        for (let entity of this.entities) {
            let ray = _calculateRayPosition(entity);

            if (!(entity.position.x === ray.x && entity.position === ray.y)) {
                let blocks = this.map.blocksBetweenPositions(entity.position, ray);

                let playerBlock = this.map.blockAtPosition(entity.position)
                if (playerBlock) {
                    if (!inBlock) {
                        inBlock = true;
                        console.log(inBlock);
                    }
                    // console.log(playerBlock.position);
                    // console.log('view', playerBlock.view.position);
                } else {
                    if (inBlock) {
                        inBlock = false;
                        console.log(inBlock);
                    }
                }


                // if (blocks.length > 0) {
                //     debug('collision candidates', blocks[0].position, entity.position, ray);
                // }
            }

            // if (!(entity.position.x === ray.x && entity.position.y === ray.y)) {
            //     debug('old x, y', [entity.position.x, entity.position.y],
            //             'new x, y', [ray.x, ray.y]);
            // }
        }
    }
}

module.exports = Physics;
