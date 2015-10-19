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
        // for (let entity of this.entities) {
        //     let start = { x: 0, y: 0, z: 0 };
        //     let end = { x: this.map.totalWidth, y: this.map.totalHeight, z: entity.position.z };
        //
        //     let blocks = this.map.blocksBetweenPositions(start, end);
        //
        //     if (blocks.length > 0) {
        //         for (let block of blocks) {
        //             let westWall = block.wallBodies.west;
        //
        //             if (westWall) {
        //                 let res = new SAT.Response();
        //                 let collided = SAT.testPolygonPolygon(entity.body, westWall);
        //
        //                 if (collided) {
        //                     console.log(collided);
        //                 }
        //             }
        //         }
        //     }
        // }
    }
}

module.exports = Physics;
