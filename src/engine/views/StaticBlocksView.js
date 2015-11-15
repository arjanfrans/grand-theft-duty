let debug = require('debug')('game:engine/views/merged-block');

import TextureAtlas from '../graphics/TextureAtlas';
import View from './View';

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

let _createMergedBlockGeometry = function (blocks, textureAtlas) {
    let mergedGeometry = new THREE.Geometry();

    for (let block of blocks) {
        let geometry = _createBlockGeometry(block, textureAtlas);

        geometry.translate(block.position.x, block.position.y, block.position.z);

        mergedGeometry.merge(geometry);
        mergedGeometry.mergeVertices();
    }

    return mergedGeometry;
};

class StaticBlocksView extends View {
    constructor (blocks, textureAtlasName) {
        super();

        this.textureAtlasName = textureAtlasName;
        this.blocks = blocks;

        if (blocks.length > 0) {
            this.blockWidth = blocks[0].width;
            this.blockHeight = blocks[0].height;
            this.blockDepth = blocks[0].depth;
        } else {
            this.blockWidth = 0;
            this.blockHeight = 0;
            this.blockDepth = 0;
        }
    }

    init () {
        this.textureAtlas = new TextureAtlas(this.textureAtlasName, false);

        this.geometry = _createMergedBlockGeometry(this.blocks, this.textureAtlas);

        this.material = new THREE.MeshLambertMaterial({
            map: this.textureAtlas.texture,
            transparent: true,
            side: THREE.DoubleSide
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.set(0, 0, 0);

        // Set the center of the blocks to bottom left (instead of center)
        this.mesh.translateX(this.blockWidth / 2);
        this.mesh.translateY(this.blockHeight / 2);
        this.mesh.translateZ(this.blockDepth / 2);

        this._initialized = true;
    }
}

export default StaticBlocksView;
