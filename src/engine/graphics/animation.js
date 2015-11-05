
class Animation {
    constructor (textureAtlas, geometry, interval = 2000, repeat = true, frames = [],
            framePrefix = '') {
        this.textureAtlas = textureAtlas;
        this.geometry = geometry;

        let frameSize = this.textureAtlas.getFrameSize(framePrefix + frames[0]);

        this.frameWidth = frameSize.width;
        this.frameHeight = frameSize.height;

        this.interval = interval;
        this.frames = frames;
        this.framePrefix = framePrefix;
        this.currentFrameIndex = 0;
        this.currentDisplayTime = 0;

        this._updateGeometry();
    }

    get texture () {
        return this.textureAtlas.texture;
    }

    _updateGeometry () {
        let currentFrame = this.frames[this.currentFrameIndex];
        let bounds = this.textureAtlas.getBounds(this.framePrefix + currentFrame);

        this.geometry.faceVertexUvs[0][0] = [bounds[0], bounds[1], bounds[3]];
        this.geometry.faceVertexUvs[0][1] = [bounds[1], bounds[2], bounds[3]];
        this.geometry.uvsNeedUpdate = true;
    }

    _updateTexture () {
        let currentFrame = this.frames[this.currentFrameIndex];
        let bounds = this.textureAtlas.getFrameOffset(this.framePrefix + currentFrame);

        this.texture.offset = bounds;
    }

    update (delta) {
        // Convert to millis
        this.currentDisplayTime += delta * 1000;

        // console.log(this.interval, this.currentDisplayTime);
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

module.exports = Animation;
