import RenderView from '../../../engine/graphics/RenderView';

class MenuRenderView extends RenderView {
    constructor (state) {
        super();

        this.state = state;
        this.menu = state.menu;
        this.clearColor = 0x002422;
    }

    init () {
        super.init();

        this.camera = new THREE.OrthographicCamera(-this.width / 2, this.width / 2,
            this.height / 2, -this.height / 2, 0, 1);

        let ambientLight = new THREE.AmbientLight(0xccccff);

        this.scene.add(ambientLight);

        this._initialized = true;
    }

    update (delta) {
        super.update(delta);
    }
}

export default MenuRenderView;
