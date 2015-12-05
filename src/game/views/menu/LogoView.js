import View from '../../../engine/views/View';
import TextureFrame from '../../../engine/graphics/TextureFrame';
import TextureManager from '../../../engine/graphics/TextureManager';

class LogoView extends View {
    constructor (textureName, textureAtlasName) {
        super();

        this.textureName = textureName;
        this.textureAtlasName = textureAtlasName;
    }

    init () {
        let textureAtlas = TextureManager.getAtlas(this.textureAtlasName, true);
        let logoSize = textureAtlas.getFrameSize(this.textureName);

        this.geometry = new THREE.PlaneGeometry(logoSize.width, logoSize.height);

        let textureFrame = new TextureFrame(textureAtlas, this.geometry, this.textureName);
        let material = new THREE.MeshBasicMaterial({
            map: textureFrame.texture,
            transparent: true
        });

        this.mesh = new THREE.Mesh(this.geometry, material);

        super.init();
    }
};

export default LogoView;