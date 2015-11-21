class Animation {
    constructor (textureAtlas, geometry, interval = 10, repeat = true, frames = [],
            framePrefix = '') {
        this.textureAtlas = textureAtlas;
        this.geometry = geometry;

        this.interval = interval;
        this.frames = frames;
        this.framePrefix = framePrefix;
        this.currentFrameIndex = 0;
        this.currentDisplayTime = 0;

        // Use the first frame as a size reference
        let bounds = this.textureAtlas.getBounds(framePrefix + frames[0]);

        this.geometry.faceVertexUvs[0][0] = [bounds[0], bounds[1], bounds[3]];
        this.geometry.faceVertexUvs[0][1] = [bounds[1], bounds[2], bounds[3]];

        this._updateTexture();
    }

    get texture () {
        return this.textureAtlas.texture;
    }

    _updateTexture () {
        let currentFrame = this.framePrefix + this.frames[this.currentFrameIndex];

        let offset = this.textureAtlas.getFrameOffset(currentFrame);

        this.texture.offset = offset;
    }

    update (delta) {
        this.currentDisplayTime += 1;

        if (this.currentDisplayTime > this.interval) {
            this.currentDisplayTime = 0;

            this.currentFrameIndex++;

            if (this.currentFrameIndex >= this.frames.length) {
                this.currentFrameIndex = 0;
            }

            this._updateTexture();
        }
    }

    get currentFrame () {
        return this.frames[this.currentFrameIndex];
    }
};

export default Animation;
