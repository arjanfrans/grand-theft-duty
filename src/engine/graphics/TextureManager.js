import TextureAtlas from './TextureAtlas';
let _atlases = new Map();

let TextureManager = {
    getAtlas (name, clone) {
        if (clone) {
            return new TextureAtlas(name, clone);
        }

        let atlas = _atlases.get(name);

        if (!atlas) {
            atlas = new TextureAtlas(name);

            _atlases.set(name, atlas);
        }

        return atlas;
    }
};

export default TextureManager;
