let debug = require('debug')('game:engine/views/block');

import TextureAtlas from '../../engine/graphics/TextureAtlas';
import View from '../../engine/views/View';

let _createBlockGeometry = function (block, textureAtlas) {
    let geometries = [];

    if (block.walls.south) {
        let south = textureAtlas.getBounds(block.walls.south);

        let southGeometry = new THREE.PlaneGeometry(block.width, block.height);

        southGeometry.faceVertexUvs[0][0] = [south[0], south[1], south[3]];
        southGeometry.faceVertexUvs[0][1] = [south[1], south[2], south[3]];
        southGeometry.rotateY(Math.PI / 2);
        southGeometry.translate(block.width / 2, 0, 0);

        geometries.push(southGeometry);
    }

    if (block.walls.north) {
        let north = textureAtlas.getBounds(block.walls.north);

        let northGeometry = new THREE.PlaneGeometry(block.width, block.height);

        northGeometry.faceVertexUvs[0][0] = [north[0], north[1], north[3]];
        northGeometry.faceVertexUvs[0][1] = [north[1], north[2], north[3]];
        northGeometry.rotateY(-(Math.PI / 2));
        northGeometry.translate(-(block.width / 2), 0, 0);

        geometries.push(northGeometry);
    }

    if (block.walls.west) {
        let west = textureAtlas.getBounds(block.walls.west);

        let westGeometry = new THREE.PlaneGeometry(block.width, block.height);

        westGeometry.faceVertexUvs[0][0] = [west[0], west[1], west[3]];
        westGeometry.faceVertexUvs[0][1] = [west[1], west[2], west[3]];
        westGeometry.rotateX((Math.PI / 2));
        westGeometry.translate(0, -(block.height / 2), 0);

        geometries.push(westGeometry);
    }

    if (block.walls.east) {
        let east = textureAtlas.getBounds(block.walls.east);

        let eastGeometry = new THREE.PlaneGeometry(block.width, block.height);

        eastGeometry.faceVertexUvs[0][0] = [east[0], east[1], east[3]];
        eastGeometry.faceVertexUvs[0][1] = [east[1], east[2], east[3]];
        eastGeometry.rotateX(-(Math.PI / 2));
        eastGeometry.rotateY((Math.PI / 2));
        eastGeometry.translate(0, (block.height / 2), 0);

        geometries.push(eastGeometry);
    }

    if (block.walls.top) {
        let top = textureAtlas.getBounds(block.walls.top);

        let topGeometry = new THREE.PlaneGeometry(block.width, block.height);

        topGeometry.faceVertexUvs[0][0] = [top[0], top[1], top[3]];
        topGeometry.faceVertexUvs[0][1] = [top[1], top[2], top[3]];
        topGeometry.translate(0, 0, (block.height / 2));

        geometries.push(topGeometry);
    }

    let blockGeometry = new THREE.Geometry();

    for (let geometry of geometries) {
        blockGeometry.merge(geometry);
    };

    return blockGeometry;
};

class BlockView extends View {
    constructor (block, textureAtlasName) {
        super();

        this.block = block;
    }

    init () {
        let block = this.block;

        this.textureAtlas = new TextureAtlas(textureAtlasName, false);

        this.geometry = _createBlockGeometry(block, this.textureAtlas);

        this.material = new THREE.MeshLambertMaterial({
            map: this.textureAtlas.texture,
            transparent: true,
            side: THREE.DoubleSide
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        let position = {
            x: block.position.x,
            y: block.position.y,
            z: block.position.z
        };

        this.mesh.position.set(position.x, position.y, position.z);

        // Set the center of the blocks to bottom left (instead of center)
        this.mesh.translateX(block.width / 2);
        this.mesh.translateY(block.height / 2);
        this.mesh.translateZ(block.depth / 2);
        this._initialized = true;
    }
}

export default BlockView;
