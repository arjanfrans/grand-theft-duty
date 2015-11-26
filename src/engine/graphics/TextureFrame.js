class TextureFrame {
    constructor (textureAtlas, geometry, initialFrame, fixed = false) {
        this.textureAtlas = textureAtlas;
        this.geometry = geometry;
        this.fixed = fixed;

        if (initialFrame) {
            this.frame = initialFrame;

            if (fixed) {
                let size = this.textureAtlas.getFrameSize(initialFrame);

                this._changeSize(size.width, size.height);
            }
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

        if (this.geometry) {
            // TODO make this more efficient (no new instances necessary)
            let bounds = [
                new THREE.Vector2(0, ah / ah), // lower left
                new THREE.Vector2(0, (ah - height) / ah), // upper left
                new THREE.Vector2(width / aw, (ah - height) / ah), // upper right
                new THREE.Vector2(width / aw, ah / ah) // lower right
            ];

            // If a geometry is merged, for example multiple planes
            for (let i = 1; i < this.geometry.faceVertexUvs[0].length; i += 2) {
                this.geometry.faceVertexUvs[0][i - 1] = [bounds[0], bounds[1], bounds[3]];
                this.geometry.faceVertexUvs[0][i] = [bounds[1], bounds[2], bounds[3]];
            }

            this.geometry.uvsNeedUpdate = true;
        }
    }

    set frame (frameName) {
        let offset = this.textureAtlas.getFrameOffset(frameName);
        let size = this.textureAtlas.getFrameSize(frameName);

        // Size changed
        if (!this.fixed) {
            if (size.width !== this.width || size.height !== this.height) {
                this._changeSize(size.width, size.height);
            }
        }

        this.texture.offset = offset;
    }
}

export default TextureFrame;
