let debug = require('debug')('game:views/world');

import MergedBlocksView from '../engine/views/merged-blocks';
import BulletView from '../engine/views/bullet';
import ObjectPool from '../engine/object-pool';

let _createMergedBlockView = function (layers) {
    let blocks = [];

    for (let z = 0; z < layers.length; z++) {
        let layer = layers[z];

        for (let y = 0; y < layer.length; y++) {
            for (let x = 0; x < layer[y].length; x++) {
                let block = layer[y][x];

                if (block !== null) {
                    blocks.push(block);
                }
            };
        }
    }

    return new MergedBlocksView(blocks);
};

class WorldView {
    constructor (world) {
        // TODO move resolution away from here
        this.width = 800;
        this.height = 600;

        this.world = world;

        this.dynamicViews = new Set();
        this.bulletViewPool = null;
        this.bulletViewPairs = new WeakMap();
    }

    init () {
        this.scene = new THREE.Scene();

        this.bulletViewPool = new ObjectPool(() => {
            let bullet = new BulletView(null);

            return bullet;
        }, 10, 10);

        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 1, 100000);

        this.camera.position.x = (this.world.width / 2) * this.world.tileWidth;
        this.camera.position.y = (this.world.height / 2) * this.world.tileHeight;
        this.camera.position.z = this.world.tileDepth * 6;

        let blockView = _createMergedBlockView(this.world.mapLayers);

        blockView.init();

        this.scene.add(blockView.mesh);

        for (let view of this.dynamicViews.values()) {
            view.init();

            this.scene.add(view.mesh);
        }

        let ambientLight = new THREE.AmbientLight(0xcccccc);

        this.scene.add(ambientLight);

        // let directionalLight = new THREE.DirectionalLight(0x00ffff, 2);
        //
        // directionalLight.position.set(world.width / 2, world.height / 2, world.depth).normalize();
        // this.scene.add(directionalLight);
    }

    update (delta) {
        let player = this.world.player;

        this.camera.position.setX(player.position.x);
        this.camera.position.setY(player.position.y);

        for (let view of this.dynamicViews) {
            view.update(delta);
        }

        let bulletSystem = this.world.bulletSystem;

        // Keep viewPool in sync with bullet pool
        if (bulletSystem.poolSize > this.bulletViewPool.size) {
            this.bulletViewPool.allocate(bulletSystem.poolSize - this.bulletViewPool.size);
        }

        for (let bullet of bulletSystem.activeBullets) {
            let bulletView = this.bulletViewPairs.get(bullet);

            if (!bulletView) {
                bulletView = this.bulletViewPool.get();

                bulletView.bullet = bullet;
                bulletView.init();

                this.scene.add(bulletView.mesh);

                this.bulletViewPairs.set(bullet, bulletView);
            }

            bulletView.update(delta);
        }
    }
}

module.exports = WorldView;
