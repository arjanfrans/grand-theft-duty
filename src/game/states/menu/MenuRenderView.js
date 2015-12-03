import RenderView from '../../../engine/graphics/RenderView';

class MenuRenderView extends RenderView {
    constructor (state) {
        super();

        this.state = state;
        this.menu = state.menus;
        this.clearColor = 0x000000;
    }

    init () {
        super.init();

        this.camera = new THREE.OrthographicCamera(0, this.width,
            this.height, 0, 0, 1);

        this._initialized = true;
    }

    update (delta) {
        super.update(delta);

        if (this.currentViewContainerName !== this.state.currentMenuName) {
            this.currentViewContainer = this.state.currentMenuName;
        }
    }
}

export default MenuRenderView;
