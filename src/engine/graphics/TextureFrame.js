class TextureFrame {
    constructor (textureAtlas, geometry, initialFrame) {
        this.textureAtlas = textureAtlas;
        this.geometry = geometry;

        if (initialFrame) {
            this.frame = initialFrame;
        }
    }

    get texture () {
        return this.textureAtlas.texture;
    }

    _changeSize (width, height) {
        this.width = width;
        this.height = height;
        let aw = this.textureAtlas.width;
        let ah = this.textureAtlas.height;

        // TODO make this more efficient (no new instances necessary)
        let bounds = [
            new THREE.Vector2(0, ah / ah), // lower left
            new THREE.Vector2(0, (ah - height) / ah), // upper left
            new THREE.Vector2(width / aw, (ah - height) / ah), // upper right
            new THREE.Vector2(width / aw, ah / ah) // lower right
        ];

        this.geometry.faceVertexUvs[0][0] = [bounds[0], bounds[1], bounds[3]];
        this.geometry.faceVertexUvs[0][1] = [bounds[1], bounds[2], bounds[3]];

        this.geometry.uvsNeedUpdate = true;
    }

    set frame (frameName) {
        let offset = this.textureAtlas.getFrameOffset(frameName);
        let size = this.textureAtlas.getFrameSize(frameName);

        // Size changed
        if (size.width !== this.width || size.height !== this.height) {
            this._changeSize(size.width, size.height);
        }

        this.texture.offset = offset;
    }
}

export default TextureFrame;
