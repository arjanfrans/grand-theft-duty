let debug = require('debug')('game:views/world');

let BlockView = require('../engine/views/block');

// TODO this can be much more efficient (merge the geometries)
let _createBlockViews = function (layers) {
    let blockViews = [];

    for (let z = 0; z < layers.length; z++) {
        let layer = layers[z];

        for (let y = 0; y < layer.length; y++) {
            for (let x = 0; x < layer[y].length; x++) {
                let block = layer[y][x];

                if (block !== null) {
                    blockViews.push(new BlockView(block));
                }
            };
        }
    }

    return blockViews;
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
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 1, 100000);

        this.camera.position.x = (this.world.width / 2) * this.world.tileWidth;
        this.camera.position.y = (this.world.height / 2) * this.world.tileHeight;
        this.camera.position.z = this.world.tileDepth * 6;

        this.scene = new THREE.Scene();

        let blockViews = _createBlockViews(this.world.mapLayers);

        for (let blockView of blockViews) {
            blockView.init();

            this.scene.add(blockView.mesh);
        }

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
    }
}

module.exports = WorldView;
