import { DoubleSide, Matrix4, Mesh, MeshLambertMaterial, Geometry, PlaneGeometry } from 'three';
import {View} from "../engine/graphics/View";
import {TextureManager} from "../engine/graphics/TextureManager";
import WorldMap from "../core/maps/WorldMap";
import TextureAtlas from "../engine/graphics/TextureAtlas";

function wallBlockGeometry (block, textureAtlas) {
    const geometries: Geometry[] = [];

    if (block.walls.south) {
        const south = textureAtlas.getBounds(block.walls.south);

        const southGeometry = new PlaneGeometry(block.width, block.height);

        southGeometry.faceVertexUvs[0][0] = [south[0], south[1], south[3]];
        southGeometry.faceVertexUvs[0][1] = [south[1], south[2], south[3]];
        southGeometry.rotateY(Math.PI / 2);
        southGeometry.translate(block.width / 2, 0, 0);

        geometries.push(southGeometry);
    }

    if (block.walls.north) {
        const north = textureAtlas.getBounds(block.walls.north);

        const northGeometry = new PlaneGeometry(block.width, block.height);

        northGeometry.faceVertexUvs[0][0] = [north[0], north[1], north[3]];
        northGeometry.faceVertexUvs[0][1] = [north[1], north[2], north[3]];
        northGeometry.rotateY(-(Math.PI / 2));
        northGeometry.translate(-(block.width / 2), 0, 0);

        geometries.push(northGeometry);
    }

    if (block.walls.west) {
        const west = textureAtlas.getBounds(block.walls.west);

        const westGeometry = new PlaneGeometry(block.width, block.height);

        westGeometry.faceVertexUvs[0][0] = [west[0], west[1], west[3]];
        westGeometry.faceVertexUvs[0][1] = [west[1], west[2], west[3]];
        westGeometry.rotateX((Math.PI / 2));
        westGeometry.translate(0, -(block.height / 2), 0);

        geometries.push(westGeometry);
    }

    if (block.walls.east) {
        const east = textureAtlas.getBounds(block.walls.east);

        const eastGeometry = new PlaneGeometry(block.width, block.height);

        eastGeometry.faceVertexUvs[0][0] = [east[0], east[1], east[3]];
        eastGeometry.faceVertexUvs[0][1] = [east[1], east[2], east[3]];
        eastGeometry.rotateX(-(Math.PI / 2));
        eastGeometry.rotateY((Math.PI / 2));
        eastGeometry.translate(0, (block.height / 2), 0);

        geometries.push(eastGeometry);
    }

    if (block.walls.top) {
        const top = textureAtlas.getBounds(block.walls.top);

        const topGeometry = new PlaneGeometry(block.width, block.height);

        topGeometry.faceVertexUvs[0][0] = [top[0], top[1], top[3]];
        topGeometry.faceVertexUvs[0][1] = [top[1], top[2], top[3]];
        topGeometry.translate(0, 0, (block.height / 2));

        geometries.push(topGeometry);
    }

    const blockGeometry = new Geometry();

    for (const geometry of geometries) {
        blockGeometry.merge(geometry);
    }

    return blockGeometry;
}

function createMergedBlockGeometry (blocks, textureAtlas) {
    const mergedGeometry = new Geometry();

    for (const block of blocks) {
        const geometry = wallBlockGeometry(block, textureAtlas);

        geometry.translate(block.position.x, block.position.y, block.position.z);

        mergedGeometry.merge(geometry);
    }

    mergedGeometry.mergeVertices();

    return mergedGeometry;
}

export class StaticBlocksView extends View {
    private map: WorldMap;
    private textureAtlasName: string;
    private blocks: any;
    private blockWidth: number;
    private blockHeight: number;
    private blockDepth: number;
    private _textureAtlas?: TextureAtlas = undefined;

    constructor (map: WorldMap, textureAtlasName: string) {
        super();

        this.map = map;
        this.textureAtlasName = textureAtlasName;
        this.blocks = map.blocks(['wall']);

        this.blockWidth = map.blockWidth;
        this.blockHeight = map.blockHeight;
        this.blockDepth = map.blockDepth;
    }

    private get textureAtlas(): TextureAtlas
    {
        return this._textureAtlas as TextureAtlas;
    }

    init () {
        this._textureAtlas = TextureManager.getAtlas(this.textureAtlasName, false);
        const geometry = createMergedBlockGeometry(this.blocks, this.textureAtlas);

        const material = new MeshLambertMaterial({
            map: this.textureAtlas.texture,
            transparent: true,
            side: DoubleSide
        });

        this.mesh = new Mesh(geometry, material);

        // Set the center of the blocks to bottom left (instead of center)
        this.mesh.applyMatrix(new Matrix4().makeTranslation(this.blockWidth / 2, this.blockHeight / 2, this.blockDepth / 2));

        super.init();
    }
}
