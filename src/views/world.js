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
    }

    init () {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 1, 100000);

        this.camera.position.x = (this.world.width / 2) * this.world.tileWidth;
        this.camera.position.y = (this.world.height / 2) * this.world.tileHeight;
        this.camera.position.z = this.world.tileDepth * 6;

        let blockView = _createMergedBlockView(this.world.mapLayers);

        blockView.init();

        this.scene.add(blockView.mesh);

        for (let view of this.dynamicViews.values()) {
            view.init();

            // If a view only has one mesh
            this.scene.add(view.mesh);
        }

        let ambientLight = new THREE.AmbientLight(0xcccccc);

        this.scene.add(ambientLight);
    }

    update (delta) {
        let player = this.world.player;

        this.camera.position.setX(player.position.x);
        this.camera.position.setY(player.position.y);

        for (let view of this.dynamicViews) {
            view.update(delta, (updates) => {
                if (updates.add) {
                    this.scene.add(...updates.add);
                } else if (updates.remove) {
                    this.scene.remove(...updates.remove);
                }
            });
        }
    }
}

module.exports = WorldView;
