import TextureAtlas from './TextureAtlas';
const _atlases = new Map();

const TextureManager = {
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
