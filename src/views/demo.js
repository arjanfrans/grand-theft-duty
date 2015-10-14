let debug = require('debug')('game:views/demo');
let View = require('../engine/view');
let ImprovedNoise = require('../utils/improved-noise');
let TextureAtlas = require('../utils/texture-atlas');

// TODO efficience
// let _tileCache = new Map();
let _tilesTextureAtlas = null;

let _createBlockGeometry = function (block, blockWidth, blockHeight, blockDepth) {
    let geometry = new THREE.BoxGeometry(blockWidth, blockHeight, blockDepth);

    // ok
    if (block.south) {
        let south = _tilesTextureAtlas.getBounds(block.south);

        geometry.faceVertexUvs[0][0] = [ south[0], south[1], south[3] ];
        geometry.faceVertexUvs[0][1] = [ south[1], south[2], south[3] ];
    }

    // ok
    if (block.north) {
        let north = _tilesTextureAtlas.getBounds(block.north);

        geometry.faceVertexUvs[0][2] = [ north[0], north[1], north[3] ];
        geometry.faceVertexUvs[0][3] = [ north[1], north[2], north[3] ];
    }

    // ok
    if (block.east) {
        let east = _tilesTextureAtlas.getBounds(block.east);

        geometry.faceVertexUvs[0][4] = [ east[0], east[1], east[3] ];
        geometry.faceVertexUvs[0][5] = [ east[1], east[2], east[3] ];
    }

    //
    // ok
    if (block.west) {
        let west = _tilesTextureAtlas.getBounds(block.west);

        geometry.faceVertexUvs[0][6] = [ west[0], west[1], west[3] ];
        geometry.faceVertexUvs[0][7] = [ west[1], west[2], west[3] ];
    }

    // Ok
    if (block.top) {
        let top = _tilesTextureAtlas.getBounds(block.top);

        geometry.faceVertexUvs[0][8] = [ top[0], top[1], top[3] ];
        geometry.faceVertexUvs[0][9] = [ top[1], top[2], top[3] ];
    }

    // Bottom
    // geometry.faceVertexUvs[0][10] = [ wood[0], wood[1], wood[3] ];
    // geometry.faceVertexUvs[0][11] = [ wood[1], wood[2], wood[3] ];

    return geometry;
};

let _createBlock = function (block, blockWidth, blockHeight, blockDepth) {
    if (!block) {
        return null;
    }

    let texture = _tilesTextureAtlas.texture;

    let material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });

    let geometry = _createBlockGeometry(block, blockWidth, blockHeight, blockDepth);

    let mesh = new THREE.Mesh(
        geometry,
        material
    );

    return mesh;
};

class DemoView extends View {
    constructor (state) {
        super(800, 600);

        this.state = state;
        _tilesTextureAtlas = new TextureAtlas('tiles');
    }

    init () {
        let world = this.state.world;

        let worldWidth = world.width;
        let worldDepth = world.depth;

        let tileWidth = world.tileWidth;
        let tileHeight = world.tileHeight;
        let tileDepth = world.tileDepth;

        let worldHalfWidth = worldWidth / 2;
        let worldHalfDepth = worldDepth / 2;

        // FIXME
        this.camera.position.y = (world.height / 2) * tileHeight;
        this.camera.position.x = (world.width / 2) * tileWidth;
        this.camera.position.z = tileDepth * 6;

        debug('camera position', this.camera.position);
        debug('camera rotation', this.camera.rotation);

        // Rotate camera for top-down view.
        this.camera.rotation.z = (90) * Math.PI / 180;

        let layers = world.mapLayers;

        debug('layer', '\n' + world.map.toString());

        for (let z = 0; z < layers.length; z++) {
            let layer = layers[z];

            for (let y = 0; y < layer.length; y++) {
                for (let x = 0; x < layer[y].length; x++) {
                    let tile = layer[x][y];

                    if (tile !== null) {
                        let block = _createBlock(tile, tileWidth, tileHeight, tileDepth);

                        this.scene.add(block);

                        block.translateX(x * tileWidth);
                        block.translateY(y * tileHeight);
                        block.translateZ(z * tileDepth);

                        debug('block position', block.position);
                    }
                };
            }
        }

        let ambientLight = new THREE.AmbientLight(0xcccccc);

        this.scene.add(ambientLight);

        let directionalLight = new THREE.DirectionalLight(0x00ffff, 2);

        directionalLight.position.set(world.width / 2, world.height / 2, world.depth).normalize();
        this.scene.add(directionalLight);
    }

    update () {
        // this.mesh.rotation.x += 0.01;
    }
}

module.exports = DemoView;
