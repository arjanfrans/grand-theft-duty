let debug = require('debug')('game:engine/graphics/texture-atlas');

import AssetManager from '../AssetManager';

class TextureAtlas {
    constructor (name, clone = true) {
        this.mapping = AssetManager.getAtlasMapping(name);

        if (!this.mapping) {
            throw new Error('TextureAtlas does not exists', name);
        }

        if (clone) {
            this.texture = AssetManager.cloneTexture(name);
        } else {
            this.texture = AssetManager.getTexture(name);
        }

        this.texture.magFilter = THREE.NearestFilter;
        this.texture.minFilter = THREE.LinearMipMapLinearFilter;
        this.width = this.mapping.meta.size.w;
        this.height = this.mapping.meta.size.h;

        this.frames = new Map();

        for (let frame of this.mapping.frames) {
            let d = frame.frame;

            // Origin image is y-inverted compared to what THREE wants
            let bounds = [
                new THREE.Vector2(d.x / this.width, (this.height - (d.y)) / this.height), // lower left
                new THREE.Vector2((d.x + d.w) / this.width, (this.height - (d.y)) / this.height), // lower right
                new THREE.Vector2((d.x + d.w) / this.width, (this.height - (d.y + d.h)) / this.height), // upper right
                new THREE.Vector2(d.x / this.width, (this.height - (d.y + d.h)) / this.height) // upper left
            ];

            this.frames.set(frame.filename, {
                bounds: bounds,
                frame: frame,
                framePosition: {
                    x: d.x,
                    y: this.height - d.y
                },
                frameSize: {
                    width: d.w,
                    height: d.h
                }
            });
        }
    }

    getFrameOffset (name) {
        let d = this.frames.get(name + '.png').framePosition;
        let size = this.frames.get(name + '.png').frameSize;

        return new THREE.Vector2(d.x / this.width, (this.height - (d.y) - size.height) / this.height);
    }

    getFrameSize (name) {
        return this.frames.get(name + '.png').frameSize;
    }

    getBounds (name) {
        return this.frames.get(name + '.png').bounds;
    }
}

export default TextureAtlas;
