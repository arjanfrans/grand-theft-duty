import { RepeatWrapping, Vector2 } from 'three';
import AssetManager from '../AssetManager';

class TextureAtlas {
    constructor (name, clone, filter = {}) {
        this.mapping = AssetManager.getAtlasMapping(name);

        if (!this.mapping) {
            throw new Error('TextureAtlas does not exists', name);
        }

        if (clone) {
            this.texture = AssetManager.cloneTexture(name);
        } else {
            this.texture = AssetManager.getTexture(name);
        }

        this.texture.wrapS = RepeatWrapping;
        this.texture.wrapT = RepeatWrapping;

        this.width = this.mapping.meta.size.w;
        this.height = this.mapping.meta.size.h;

        this.frames = new Map();

        for (const frame of this.mapping.frames) {
            const d = frame.frame;

            // Origin image is y-inverted compared to what THREE wants
            const bounds = [
                new Vector2(d.x / this.width, (this.height - (d.y)) / this.height), // lower left
                new Vector2(d.x / this.width, (this.height - (d.y + d.h)) / this.height), // upper left
                new Vector2((d.x + d.w) / this.width, (this.height - (d.y + d.h)) / this.height), // upper right
                new Vector2((d.x + d.w) / this.width, (this.height - (d.y)) / this.height) // lower right
            ];

            this.frames.set(frame.filename, {
                bounds: bounds,
                frame: frame,
                framePosition: {
                    x: d.x,
                    y: d.y
                },
                frameSize: {
                    width: d.w,
                    height: d.h
                }
            });
        }
    }

    getFrameOffset (name) {
        const d = this.frames.get(name + '.png').framePosition;

        return new Vector2(d.x / this.width, (this.height - d.y) / this.height);
    }

    getFrameSize (name) {
        return this.frames.get(name + '.png').frameSize;
    }

    getBounds (name) {
        return this.frames.get(name + '.png').bounds;
    }
}

export default TextureAtlas;
