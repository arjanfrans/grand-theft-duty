let debug = require('debug')('game:engine/views/text');

import View from './view';
import createTextGeometry from 'three-bmfont-text';
import AssetLoader from '../asset-loader';

class TextView extends View {
    constructor (text,
            options = { font: 'long_shot_0', width: 100, align: 'left' }) {
        super();
        this.text = text;
        this.options = options;
    }

    init () {
        let font = AssetLoader.getFont(this.options.font);

        this.geometry = createTextGeometry({
            text: this.text,
            width: this.options.width,
            align: this.options.align,
            font: font.mapping
        });

        this.texture = font.texture;

        this.material = new THREE.MeshBasicMaterial({
            map: this.texture,
            transparent: true,
            color: 0xff0000
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.x = 0;
        this.mesh.position.y = 0;
        this.mesh.position.z = 0;
        this.mesh.rotation.y = 180 * (Math.PI / 180);
        this.mesh.rotation.z = 180 * (Math.PI / 180);

        this._initialized = true;
    }

    set color (color) {
        this.material.color.setHex(color);
    }
}

export default TextView;
