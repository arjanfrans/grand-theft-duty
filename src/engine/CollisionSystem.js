import CollisionUtils from './collision/CollisionUtils';

class CollisionSystem {
    constructor (map) {
        this.entities = new Set();
        this.map = map;
    }

    addEntity (entity) {
        this.entities.add(entity);
    }

    update (delta) {
        for (let entity of this.entities) {
            CollisionUtils.wallCollision(this.map, entity, (response) => {
                entity.position.x -= response.overlapV.x;
                entity.position.y -= response.overlapV.y;
            });

            CollisionUtils.floorCollision(this.map, entity, delta, (block) => {
                if (block.type === 'water') {
                    entity.fall();
                    entity.kill();
                } else {
                    entity.position.z = block.position.z + block.depth;
                    entity.stopFalling();
                }
            });
        }
    }
}

export default CollisionSystem;
