import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
import {TextureManager} from "../../../engine/graphics/TextureManager";
import {TextureFrame} from "../../../engine/graphics/TextureFrame";
import {View} from "../../../engine/graphics/View";

class LogoView extends View {
    constructor (textureName, textureAtlasName) {
        super();

        this.textureName = textureName;
        this.textureAtlasName = textureAtlasName;
    }

    init () {
        const textureAtlas = TextureManager.getAtlas(this.textureAtlasName, true);
        const logoSize = textureAtlas.getFrameSize(this.textureName);

        this.geometry = new PlaneGeometry(logoSize.width, logoSize.height);

        const textureFrame = new TextureFrame(textureAtlas, this.geometry, this.textureName);
        const material = new MeshBasicMaterial({
            map: textureFrame.texture,
            transparent: true
        });

        this.mesh = new Mesh(this.geometry, material);

        super.init();
    }
}

export default LogoView;
