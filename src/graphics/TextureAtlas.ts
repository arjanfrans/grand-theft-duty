import { RepeatWrapping, Texture, Vector2 } from "three";
import AtlasMapping from "./AtlasMapping";
import AtlasMappingFrame from "./AtlasMappingFrame";

class TextureAtlas {
    private texture: Texture;
    private mapping: AtlasMapping;
    private width: number;
    private height: number;

    constructor(
        texture: Texture,
        mapping: AtlasMapping,
        clone: boolean = true,
    ) {
        this.mapping = mapping;

        if (clone) {
            texture = texture.clone();

            texture.needsUpdate = true;
        }

        this.texture = texture;

        this.texture.wrapS = RepeatWrapping;
        this.texture.wrapT = RepeatWrapping;
    }

    public getWidth(): number {
        return this.mapping.getWidth();
    }

    public getHeight(): number {
        return this.mapping.getHeight();
    }

    public setTextureOffset(offset: Vector2): void {
        this.texture.offset = offset;
    }

    public getTexture(): Texture {
        return this.texture;
    }

    public getFrame(id: string): AtlasMappingFrame {
        return this.mapping.getFrame(id);
    }
}

export default TextureAtlas;
