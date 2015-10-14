const ATLAS_DIRECTORY = '../../assets/spritesheets/';

class TextureAtlas {
    constructor (name) {
        // this.mapping = require(ATLAS_DIRECTORY + name + '.js');
        this.mapping = require('../../assets/spritesheets/tiles.js');
        this.texture = THREE.ImageUtils.loadTexture(ATLAS_DIRECTORY + this.mapping.meta.image);
        this.texture.magFilter = THREE.NearestFilter;
        this.texture.minFilter = THREE.LinearMipMapLinearFilter;
        this.width = this.mapping.meta.size.w;
        this.height = this.mapping.meta.size.h;

        this.sprites = new Map();

        for (let frame of this.mapping.frames) {
            let d = frame.frame;

            // Origin image is y-inverted compared to what THREE wants
            let bounds = [
                new THREE.Vector2(d.x / this.width, (this.height - (d.y)) / this.height), // lower left
                new THREE.Vector2((d.x + d.w) / this.width, (this.height - (d.y)) / this.height), // lower right
                new THREE.Vector2((d.x + d.w) / this.width, (this.height - (d.y + d.h)) / this.height), // upper right
                new THREE.Vector2(d.x / this.width, (this.height - (d.y + d.h)) / this.height) // upper left
            ];

            console.warn(bounds);

            this.sprites.set(frame.filename, bounds);
        }
    }

    getBounds (name) {
        return this.sprites.get(name + '.png');
    }
}

module.exports = TextureAtlas;
