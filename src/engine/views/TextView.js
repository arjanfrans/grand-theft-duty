let debug = require('debug')('game:engine/views/TextView');

import View from './View';
import AssetManager from '../AssetManager';
import createTextGeometry from 'three-bmfont-text';

class TextView extends View {
    constructor (text, options = {}) {
        super();

        let fontName = options.font || 'long_shot';

        this._text = text;
        this.font = AssetManager.getFont(fontName);
        this.width = options.width || 100;
        this.align = options.aligh || 'left';
        this._color = options.color || 0xff0000;
    }

    init () {
        this.geometry = createTextGeometry({
            text: this._text,
            width: this.width,
            align: this.align,
            font: this.font.mapping
        });

        this.texture = this.font.texture;

        this.material = new THREE.MeshBasicMaterial({
            map: this.texture,
            transparent: true,
            color: this._color
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.rotation.y = 180 * (Math.PI / 180);
        this.mesh.rotation.z = 180 * (Math.PI / 180);

        this._initialized = true;
    }

    get color () {
        return this._color;
    }

    set color (color) {
        this.material.color.setHex(color);
    }

    get text () {
        return this._text;
    }

    get height () {
        return this.geometry.layout.height;
    }

    _updateGeometry () {
        this.geometry.update({
            text: this._text,
            width: this.width,
            align: this.align,
            font: this.font.mapping
        });
    }

    set text (text) {
        text = text.toString();

        // Check if text is not the same
        if (text !== this._text) {
            this._text = text;
            this._updateGeometry();
        }
    }
}

export default TextView;
