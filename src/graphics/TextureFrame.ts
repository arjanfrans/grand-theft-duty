import { Geometry, Texture, Vector2 } from "three";
import AtlasMappingFrame from "./AtlasMappingFrame";
import TextureAtlas from "./TextureAtlas";

class TextureFrame {
    private textureAtlas: TextureAtlas;
    private geometry: Geometry;
    private fixed: boolean;
    private width: number;
    private height: number;
    private currentFrame: AtlasMappingFrame;

    constructor(
        textureAtlas,
        geometry,
        initialFrame,
        fixed: boolean = false,
    ) {
        this.textureAtlas = textureAtlas;
        this.geometry = geometry;
        this.fixed = fixed;

        if (initialFrame) {
            this.currentFrame = initialFrame;

            if (fixed) {
                const frame = this.textureAtlas.getFrame(initialFrame);

                this.changeSize(frame.getWidth(), frame.getHeight());
            }
        }
    }

    public getTexture(): Texture {
        return this.textureAtlas.getTexture();
    }

    public setCurrentFrame(id: string): void {
        const frame = this.textureAtlas.getFrame(id);

        const offset = frame.getOffset();

        // Size changed
        if (!this.fixed) {
            if (frame.getWidth() !== this.width || frame.getHeight() !== this.height) {
                this.changeSize(frame.getWidth(), frame.getHeight());
            }
        }

        this.textureAtlas.setTextureOffset(offset);
        this.currentFrame = frame;
    }

    protected changeSize(width, height): void {
        const aw = this.textureAtlas.getWidth();
        const ah = this.textureAtlas.getHeight();

        if (this.geometry) {
            // TODO make this more efficient (no new instances necessary)
            const bounds = [
                new Vector2(0, ah / ah), // lower left
                new Vector2(0, (ah - height) / ah), // upper left
                new Vector2(width / aw, (ah - height) / ah), // upper right
                new Vector2(width / aw, ah / ah), // lower right
            ];

            // If a geometry is merged, for example multiple planes
            for (let i = 1; i < this.geometry.faceVertexUvs[0].length; i += 2) {
                this.geometry.faceVertexUvs[0][i - 1] = [bounds[0], bounds[1], bounds[3]];
                this.geometry.faceVertexUvs[0][i] = [bounds[1], bounds[2], bounds[3]];
            }

            this.geometry.uvsNeedUpdate = true;
        }
    }
}

export default TextureFrame;
