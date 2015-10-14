let debug = require('debug')('game:views/demo');
let View = require('../engine/view');
let ImprovedNoise = require('../utils/improved-noise');

// TODO efficience
// let _tileCache = new Map();

let _createBlock = function (block, blockWidth, blockHeight, blockDepth) {
    if (!block) {
        return null;
    }

    let texture = THREE.ImageUtils.loadTexture('assets/images/minecraft.png');

    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;

    let material = new THREE.MeshBasicMaterial({ map: texture });

    // FIXME determine what is what
    // http://stackoverflow.com/questions/17418118/three-js-cube-with-different-texture-on-each-face
    let materials = [
        material, // L?
        material, // R?
        material, // T?
        material, // B?
        material, // F?
        material // B?
    ];

    let mesh = new THREE.Mesh(
        new THREE.BoxGeometry(blockWidth, blockHeight, blockDepth),
        new THREE.MeshFaceMaterial(materials)
    );

    return mesh;
};

class DemoView extends View {
    constructor (state) {
        super(800, 600);

        this.state = state;
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
        this.camera.rotation.z = 90 * Math.PI / 180;

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
