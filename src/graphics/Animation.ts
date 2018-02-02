import { Geometry, Texture } from "three";
import AtlasMappingFrame from "./AtlasMappingFrame";
import TextureAtlas from "./TextureAtlas";
import TextureFrame from "./TextureFrame";

class Animation {
    private textureAtlas: TextureAtlas;
    private geometry: Geometry;
    private interval: number;
    private textureFrame: TextureFrame;
    private frames: AtlasMappingFrame[] = [];
    private framePrefix: string;
    private currentFrameIndex: number = 0;
    private currentDisplayTime: number = 0;

    constructor(
        textureAtlas: TextureAtlas,
        geometry: Geometry,
        interval: number,
        repeat: boolean = true,
        frames: AtlasMappingFrame[] = [],
        framePrefix: string = "",
        fixed: boolean = false,
    ) {
        this.textureAtlas = textureAtlas;
        this.geometry = geometry;

        // Use the first frame as a size reference
        this.textureFrame = new TextureFrame(this.textureAtlas, geometry, framePrefix + frames[0], fixed);

        this.interval = interval;
        this.frames = frames;
        this.framePrefix = framePrefix;

        this.updateTexture();
    }

    public getTexture(): Texture {
        return this.textureAtlas.getTexture();
    }

    public reset(): void {
        this.currentFrameIndex = 0;
        this.currentDisplayTime = 0;
    }

    public update(delta): void {
        this.currentDisplayTime += 1;

        if (this.currentDisplayTime > this.interval) {
            this.currentDisplayTime = 0;

            this.currentFrameIndex++;

            if (this.currentFrameIndex >= this.frames.length) {
                this.currentFrameIndex = 0;
            }

            this.updateTexture();
        }
    }

    public getCurrentFrame(): AtlasMappingFrame {
        return this.frames[this.currentFrameIndex];
    }

    private updateTexture(): void {
        const currentFrame = this.framePrefix + this.frames[this.currentFrameIndex];

        this.textureFrame.setCurrentFrame(currentFrame);
    }
}

export default Animation;
