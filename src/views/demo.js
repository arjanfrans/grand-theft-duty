let debug = require('debug')('game:views/demo');
let View = require('../engine/view');
let ImprovedNoise = require('../utils/improved-noise');
let TextureAtlas = require('../utils/texture-atlas');

// TODO efficience
// let _tileCache = new Map();
let _tilesTextureAtlas = null;
let _tilesMaterial = null;

let _playerTextureAtlas = null;

let _createBlockGeometry = function (block, blockWidth, blockHeight, blockDepth) {
    let geometries = [];

    // ok
    if (block.south) {
        let south = _tilesTextureAtlas.getBounds(block.south);

        let southGeometry = new THREE.PlaneGeometry(blockWidth, blockHeight);

        southGeometry.faceVertexUvs[0][0] = [south[0], south[1], south[3]];
        southGeometry.faceVertexUvs[0][1] = [south[1], south[2], south[3]];
        southGeometry.rotateY(Math.PI / 2);
        southGeometry.translate(blockWidth / 2, 0, 0);

        geometries.push(southGeometry);
    }

    let northGeometry = null;

    // ok
    if (block.north) {
        let north = _tilesTextureAtlas.getBounds(block.north);

        let northGeometry = new THREE.PlaneGeometry(blockWidth, blockHeight);

        northGeometry.faceVertexUvs[0][0] = [north[0], north[1], north[3]];
        northGeometry.faceVertexUvs[0][1] = [north[1], north[2], north[3]];
        northGeometry.rotateY(-(Math.PI / 2));
        northGeometry.translate(-(blockWidth / 2), 0, 0);

        geometries.push(northGeometry);
    }

    if (block.west) {
        let west = _tilesTextureAtlas.getBounds(block.west);

        let westGeometry = new THREE.PlaneGeometry(blockWidth, blockHeight);

        westGeometry.faceVertexUvs[0][0] = [west[0], west[1], west[3]];
        westGeometry.faceVertexUvs[0][1] = [west[1], west[2], west[3]];
        westGeometry.rotateX((Math.PI / 2));
        westGeometry.translate(0, -(blockHeight / 2), 0);

        geometries.push(westGeometry);
    }

    if (block.east) {
        let east = _tilesTextureAtlas.getBounds(block.east);

        let eastGeometry = new THREE.PlaneGeometry(blockWidth, blockHeight);

        eastGeometry.faceVertexUvs[0][0] = [east[0], east[1], east[3]];
        eastGeometry.faceVertexUvs[0][1] = [east[1], east[2], east[3]];
        eastGeometry.rotateX(-(Math.PI / 2));
        eastGeometry.rotateY((Math.PI / 2));
        eastGeometry.translate(0, (blockHeight / 2), 0);

        geometries.push(eastGeometry);
    }

    if (block.top) {
        let top = _tilesTextureAtlas.getBounds(block.top);

        let topGeometry = new THREE.PlaneGeometry(blockWidth, blockHeight);

        topGeometry.faceVertexUvs[0][0] = [top[0], top[1], top[3]];
        topGeometry.faceVertexUvs[0][1] = [top[1], top[2], top[3]];
        topGeometry.translate(0, 0, (blockHeight / 2));

        geometries.push(topGeometry);
    }

    let blockGeometry = new THREE.Geometry();

    for (let geometry of geometries) {
        blockGeometry.merge(geometry);
    };

    return blockGeometry;
};

let _createBlock = function (block, position, blockWidth, blockHeight, blockDepth) {
    if (!block) {
        return null;
    }

    let geometry = _createBlockGeometry(block, blockWidth, blockHeight, blockDepth);

    let mesh = new THREE.Mesh(
        geometry,
        _tilesMaterial
    );

    mesh.position.set(position.x, position.y, position.z);

    return mesh;
};

let _createPlayer = function (player) {
    let playerMaterial = new THREE.MeshBasicMaterial({
        map: _playerTextureAtlas.texture,
        transparent: true
    });

    let playerGeometry = new THREE.PlaneGeometry(player.width, player.height);

    let bounds = _playerTextureAtlas.getBounds('dude_idle_0001');

    playerGeometry.faceVertexUvs[0][0] = [bounds[0], bounds[1], bounds[3]];
    playerGeometry.faceVertexUvs[0][1] = [bounds[1], bounds[2], bounds[3]];

    let mesh = new THREE.Mesh(playerGeometry, playerMaterial);

    mesh.position.set(player.position.x, player.position.y, player.position.z);
    mesh.rotation.z = player.angleRadian;

    return mesh;
};

class DemoView extends View {
    constructor (state) {
        super(800, 600);

        this.state = state;
        _tilesTextureAtlas = new TextureAtlas('tiles');
        _tilesMaterial = new THREE.MeshLambertMaterial({
            map: _tilesTextureAtlas.texture,
            transparent: true
        });

        _playerTextureAtlas = new TextureAtlas('dude');

        this.player = this.state.player;

        this.playerView = _createPlayer(this.player);
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

        let layers = world.mapLayers;

        debug('layer', '\n' + world.map.toString());

        for (let z = 0; z < layers.length; z++) {
            let layer = layers[z];

            for (let y = 0; y < layer.length; y++) {
                for (let x = 0; x < layer[y].length; x++) {
                    let tile = layer[y][x];

                    let layerHeight = layer.length * tileHeight;

                    if (tile !== null) {
                        let position = {
                            x: x * tileWidth,
                            y: layerHeight - (y * tileHeight),
                            z: z * tileDepth
                        };

                        let block = _createBlock(tile, position, tileWidth, tileHeight, tileDepth);

                        this.scene.add(block);
                    }
                };
            }
        }

        debug('playerView position', this.playerView.position);

        this.scene.add(this.playerView);

        let ambientLight = new THREE.AmbientLight(0xcccccc);

        this.scene.add(ambientLight);

        // let directionalLight = new THREE.DirectionalLight(0x00ffff, 2);
        //
        // directionalLight.position.set(world.width / 2, world.height / 2, world.depth).normalize();
        // this.scene.add(directionalLight);
    }

    update () {
        let tw = this.state.world.map.tileWidth;
        let th = this.state.world.map.tileHeight;

        this.playerView.position.x = this.player.position.x;
        this.playerView.position.y = this.player.position.y;
        this.playerView.position.z = this.player.position.z;

        this.playerView.rotation.z = this.player.angleRadian;

        this.camera.position.setX(this.playerView.position.x);
        this.camera.position.setY(this.playerView.position.y);
    }
}

module.exports = DemoView;
