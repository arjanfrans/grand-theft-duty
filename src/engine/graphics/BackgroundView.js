import TextureManager from './TextureManager';
import TextureFrame from './TextureFrame';
import View from './View';

class BackgroundView extends View {
    constructor (textureName, textureAtlasName) {
        super();

        this.textureName = textureName;
        this.textureAtlasName = textureAtlasName;
        this._width = null;
        this._height = null;
        this._lightness = 1;
    }

    init () {
        let textureAtlas = TextureManager.getAtlas(this.textureAtlasName, true);
        let size = textureAtlas.getFrameSize(this.textureName);

        this._width = size.width;
        this._height = size.height;

        this.geometry = new THREE.PlaneGeometry(size.width, size.height);

        let textureFrame = new TextureFrame(textureAtlas, this.geometry, this.textureName);

        this.material = new THREE.MeshBasicMaterial({
            map: textureFrame.texture,
            transparent: true
        });

        let hsl = this.material.color.getHSL();

        this.material.color.setHSL(hsl.h, hsl.s, this._lightness);

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        super.init();
    }

    set lightness (lightness) {
        if (this._initalized) {
            let hsl = this.material.color.getHSL();

            this.material.color.setHSL(hsl.h, hsl.s, lightness);
        }

        this._lightness = lightness;
    }

    get lightness () {
        return this._lightness;
    }

    set width (width) {
        let scale = width / this._width ;

        this.mesh.scale.x = scale;
        this.mesh.position.x = width / 2;
    }

    set height (height) {
        let scale = height / this._height;

        this.mesh.scale.y = scale;
        this.mesh.position.y = height / 2;
    }
};

export default BackgroundView;
