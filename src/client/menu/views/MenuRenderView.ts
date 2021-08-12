import { Camera, OrthographicCamera, PerspectiveCamera } from "three";
import { ThreeRenderView } from "../../../engine/renderer/render-view/ThreeRenderView";
import { Dimension } from "../../../engine/math/Dimension";
import { MenuState } from "../MenuState";

export class MenuRenderView extends ThreeRenderView {
    public camera?: OrthographicCamera = undefined;
    private state: MenuState;
    private menu: any;

    constructor(state: MenuState) {
        super();

        this.state = state;
        this.menu = state.menus;
    }

    init() {
        super.init();

        this.camera = new OrthographicCamera(
            0,
            this.width,
            this.height,
            0,
            0,
            1
        );

        this._initialized = true;
    }

    changeSize(size: Dimension) {
        super.changeSize(size);

        this.init();
    }

    update(delta) {
        super.update(delta);

        if (this.currentViewContainerName !== this.state.currentMenuName) {
            this.currentViewContainer = this.state.currentMenuName;
        }
    }

    getCamera(): Camera | OrthographicCamera | PerspectiveCamera {
        return this.camera as OrthographicCamera;
    }
}
