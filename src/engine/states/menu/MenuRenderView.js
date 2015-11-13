let debug = require('debug')('game:engine/states/menu/MenuRenderView');

import RenderView from '../../graphics/RenderView';

class MenuRenderView extends RenderView {
    constructor (state) {
        super(state);
        this.menu = state.menu;
    }

    init () {
        super.init();

        this.camera = new THREE.OrthographicCamera(-this.width / 2, this.width / 2,
            this.height / 2, -this.height / 2, 0, 1);

        let ambientLight = new THREE.AmbientLight(0xcccccc);

        this.scene.add(ambientLight);

        this._initialized = true;
    }

    update (delta) {
        super.update(delta);
    }
}

export default MenuRenderView;
