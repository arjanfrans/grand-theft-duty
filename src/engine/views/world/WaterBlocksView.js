import TextureManager from '../../graphics/TextureManager';
import Animation from '../../graphics/Animation';
import View from '../View';

const WATER_FRAMES = [
    'animation_water_0001',
    'animation_water_0002',
    'animation_water_0003',
    'animation_water_0004',
    'animation_water_0005',
    'animation_water_0006',
    'animation_water_0007',
    'animation_water_0008',
    'animation_water_0009'
];

let _waterGeometry = function (block, textureAtlas) {
    let geometries = [];

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
        let geometry = _waterGeometry(block, textureAtlas);

        geometry.translate(block.position.x, block.position.y, block.position.z);

        mergedGeometry.merge(geometry);
    }

    mergedGeometry.mergeVertices();

    return mergedGeometry;
};

class WaterBlocksView extends View {
    constructor (map, textureAtlasName, waterFrames = WATER_FRAMES) {
        super();

        this.map = map;
        this._textureAtlasName = textureAtlasName;
        this._waterFrames = waterFrames;
        this.blocks = map.blocks(['water']);

        this.blockWidth = map.blockWidth;
        this.blockHeight = map.blockHeight;
        this.blockDepth = map.blockDepth;
    }

    init () {
        // Do not clone, since all water animates in sync
        this.textureAtlas = TextureManager.getAtlas(this._textureAtlasName, true);

        this.geometry = _createMergedBlockGeometry(this.blocks, this.textureAtlas);

        this.animation = new Animation(this.textureAtlas, this.geometry, 9, true, this._waterFrames, '', true);
        this.animation.textureFrame.width = 100;
        this.animation.textureFrame.height = 100;

        this.material = new THREE.MeshLambertMaterial({
            map: this.textureAtlas.texture,
            transparent: false
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        // Set the center of the blocks to bottom left (instead of center)
        this.mesh.applyMatrix(new THREE.Matrix4().makeTranslation(this.blockWidth / 2, this.blockHeight / 2, this.blockDepth / 2));

        super.init();
    }

    update (interpolationPercentage) {
        this.animation.update();
    }
}

export default WaterBlocksView;
