import TextureFrame from './TextureFrame';

class Animation {
    constructor (textureAtlas, geometry, interval = 10, repeat = true, frames = [],
            framePrefix = '', fixed = false) {
        this.textureAtlas = textureAtlas;
        this.geometry = geometry;

        // Use the first frame as a size reference
        this.textureFrame = new TextureFrame(this.textureAtlas, geometry, framePrefix + frames[0], fixed);

        this.interval = interval;
        this.frames = frames;
        this.framePrefix = framePrefix;
        this.currentFrameIndex = 0;
        this.currentDisplayTime = 0;

        this._updateTexture();
    }

    get texture () {
        return this.textureAtlas.texture;
    }

    _updateTexture () {
        const currentFrame = this.framePrefix + this.frames[this.currentFrameIndex];

        this.textureFrame.frame = currentFrame;
    }

    reset () {
        this.currentFrameIndex = 0;
        this.currentDisplayTime = 0;
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
}

export default Animation;
