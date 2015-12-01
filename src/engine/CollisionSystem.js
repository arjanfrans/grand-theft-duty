import CollisionUtils from './collision/CollisionUtils';

class CollisionSystem {
    constructor (state) {
        this.state = state;
        this.entities = state.soldiers;
        this.map = this.state.map;
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
